import * as UserModel from './model';
import * as UserServ from './service';
import { AE, assign, pick, has } from '../../utils';

const { UserFile } = UserServ;

/**
 * 检查是否已登录
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function checkIsLoggedIn(ctx, next) {
  return ctx.setResp('已登录');
}

/**
 * 登录
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function login(ctx, next) {
  /** @type {{ username: string, password: string }} */
  const { username, password } = ctx.paramData.body;
  const user = await UserServ.retrieveUser(username);
  if (!UserServ.isPwdMatch(user, password)) {
    throw new AE.SoftError(AE.BAD_REQUEST, '密码错误');
  }

  // 登录
  const { user_id } = user;
  assign(ctx.paramData.session, { user_id });

  return ctx.setResp('登录成功', pick(user, 'user_id', 'nickname'));
}

/**
 * 登出
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function logout(ctx, next) {
  // 登出
  delete ctx.paramData.session.user_id;
  return ctx.setResp('登出成功');
}

/**
 * 注册
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function register(ctx, next) {
  /** @type {{ username: string, password: string }} */
  const { username, password } = ctx.paramData.body;

  // 检查用户名是否存在
  const existedUser = await UserModel.findByUsername(username);
  if (existedUser) {
    throw new AE.SoftError(AE.BAD_REQUEST, '用户名已存在', `${username} 已存在`);
  }

  // 注册用户
  const credentials = { username, password: UserServ.addSalt(password) };
  const user_id = await UserModel.register(credentials);

  // 登录
  assign(ctx.paramData.session, { user_id });

  const user = await UserServ.retrieveUser(user_id, /* withPassword */ false);
  return ctx.setResp('注册成功', pick(user, 'user_id', 'nickname'));
}

/**
 * 解析 user_id
 * @param {Context} ctx
 * @param {INext}   next
 * @param {string}  id
 */
export async function parseUserId(ctx, next, id) {
  const user_id = Number(id);
  const user = await UserServ.retrieveUser(user_id);
  assign(ctx.paramData, { user });
  return next();
}

/**
 * 获取用户信息
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function getUserInfo(ctx, next) {
  const { user, curUser } = ctx.paramData;
  const refactedUser = UserServ.refactorUser({ ...user }, /* withPassword */ false);
  const followed = await UserModel.checkIsFollowing(curUser.user_id, user.user_id);
  assign(refactedUser, { followed });
  return ctx.setResp('获取个人信息成功', refactedUser);
}

/**
 * 获取用户头像或背景图
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function getUserFile(ctx, next) {
  const {
    user: { user_id },
    query: { photo },
  } = ctx.paramData;
  const downloader = new UserFile(user_id, photo);
  ctx.body = await downloader.download();
  ctx.body.msg = '获取用户文件';
}

/**
 * 更新用户信息
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function updateUser(ctx, next) {
  const { body, files, user: { user_id } } = ctx.paramData;

  /** @type {Promise[]} */
  const tasks = [];
  if (files) {
    const { avatar: [avatar] = [null], bg: [bg] = [null] } = files;
    if (avatar) {
      const uploader = new UserFile(user_id, UserFile.Type.avatar);
      tasks.push(uploader.upload(avatar.buffer));
    }
    if (bg) {
      const uploader = new UserFile(user_id, UserFile.Type.bg);
      tasks.push(uploader.upload(bg.buffer));
    }
  }

  const props = { ...body };
  if (Object.keys(props).length > 0) {
    if (has(props, 'password')) {
      props.password = UserServ.addSalt(props.password);
    }
    tasks.push(UserModel.update(user_id, props));
  }

  await Promise.all(tasks);
  return ctx.setResp('修改个人信息成功');
}

/**
 * 获取关注者列表
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function getFollowers(ctx, next) {
  const { user_id } = ctx.paramData.user;
  const followers = await UserModel.findFollowers(user_id);
  return ctx.setResp('获取关注者列表成功', followers);
}

/**
 * 关注某个用户
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function follow(ctx, next) {
  const {
    user: { user_id },
    curUser: { user_id: follower },
  } = ctx.paramData;
  // if (user_id === follower) {
  //   throw new AE.SoftError(AE.BAD_REQUEST, '不能关注自己');
  // }
  await UserModel.follow(follower, user_id);
  await ctx.setResp('关注成功');
  return next();
}

/**
 * 取消关注某个用户
 * @param {Context} ctx
 * @param {INext}   next
 */
export async function unfollow(ctx, next) {
  const {
    user: { user_id },
    curUser: { user_id: follower },
  } = ctx.paramData;
  await UserModel.unfollow(follower, user_id);
  await ctx.setResp('取消关注成功');
  return next();
}
