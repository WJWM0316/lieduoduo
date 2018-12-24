Page({
  bindTextAreaBlur(e) {
    console.log(e.detail.value)
  },
  formSubmit(e) {
    console.log(e.detail.value.textarea)
  }
})