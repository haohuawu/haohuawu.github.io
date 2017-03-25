export default function typeOf(instance, type) {
  return Object.prototype.toString.call(instance).slice(8, -1).toLowerCase() === type.toLowerCase();
}
