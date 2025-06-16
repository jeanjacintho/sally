// js/common/utilities/private-helpers.js
function __accessCheck(obj, member, msg) {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
}
function __privateGet(obj, member, getter) {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
}
function __privateAdd(obj, member, value) {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
}
function __privateSet(obj, member, value, setter) {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
}
function __privateMethod(obj, member, method) {
  __accessCheck(obj, member, "access private method");
  return method;
}
window.__privateGet = __privateGet;
window.__privateAdd = __privateAdd;
window.__privateSet = __privateSet;
window.__privateMethod = __privateMethod;

export {
  __privateGet,
  __privateAdd,
  __privateSet,
  __privateMethod
};