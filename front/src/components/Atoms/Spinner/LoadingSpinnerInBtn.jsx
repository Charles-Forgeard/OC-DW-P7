import LoadingSpinner from './LoadingSpinner'

function LoadingSpinnerInBtn(className) {
  return (
    <LoadingSpinner
      size="1.5"
      sizeUnit="em"
      className={`${className ?? ''} text-white float-end`}
    />
  )
}

export default LoadingSpinnerInBtn
