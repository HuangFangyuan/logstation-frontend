import element from 'element-ui'

export default {
  success:(msg) => {
    element.Message.success(msg);
  },
  error:(msg) => {
    element.Message.error(msg);
  }
}
