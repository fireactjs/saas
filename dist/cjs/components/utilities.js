"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkPermission = void 0;
const checkPermission = (subscription, uid, permissions) => {
  let allow = false;
  for (let i = 0; i < permissions.length; i++) {
    if (subscription.permissions && subscription.permissions[permissions[i]]) {
      if (subscription.permissions[permissions[i]].indexOf(uid) >= 0) {
        allow = true;
      }
    }
  }
  if (subscription.ownerId === uid) {
    allow = true;
  }
  return allow;
};
exports.checkPermission = checkPermission;