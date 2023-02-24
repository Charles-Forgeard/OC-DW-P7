import ChevronRight from '../Atoms/Icons/ChevronRightSvg.jsx'
import ListBtn from '../Atoms/Btn/ListBtn.jsx'
import useToggle from '../../hooks/useToggle'

function UserOptionsMenu_item({ children, title, onSubmit, autoFocus }) {
  const [isBlock, toggleDisplay] = useToggle(false)
  //const [chevronStyle, setChevronStyle] = React.useState({transform : '', transition: 'transform 0.3s ease'});
  const style = isBlock
    ? {
        transform: 'rotate(90deg)',
      }
    : {}
  function onClickToggleMenu(event) {
    event.preventDefault()
    toggleDisplay()
  }

  return (
    <li>
      <ChevronRight className="text-secondary" style={style} />
      <ListBtn onClickEvent={onClickToggleMenu} autoFocus={autoFocus}>
        {title}
      </ListBtn>
      <form
        className={`${isBlock ? 'd-block' : 'd-none'} ms-3 ps-3`}
        onSubmit={onSubmit}
      >
        {children}
      </form>
    </li>
  )
}

export default UserOptionsMenu_item
