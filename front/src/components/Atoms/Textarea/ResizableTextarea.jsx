function ResizableTextarea({
  textareaRef,
  isResizable = true,
  height = 54,
  defaultValue,
  placeholder,
  className,
}) {
  function onKeyUpAutoResize(event) {
    if (event.target.scrollHeight > height)
      event.target.style.height = event.target.scrollHeight + 'px'
    if (event.target.value === '') event.target.style.height = `${height}px`
  }

  return (
    <textarea
      ref={textareaRef}
      placeholder={placeholder}
      className={className}
      style={{ height: height }}
      onKeyUp={isResizable && onKeyUpAutoResize}
      defaultValue={defaultValue}
    ></textarea>
  )
}

export default ResizableTextarea
