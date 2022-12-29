import {useEffect} from 'react'
    
function  useClickOutside({ref, callback, elementId}){

    console.log('useClickOutside')

    function onClickOutside(event) {
      const element = ref ? ref.current : document.querySelector(`#${elementId}`);
      
      if(element){
        if (!element.contains(event.target)) {
          callback()
        }
      }

    }
  
    useEffect(() => {

        window.addEventListener('click', onClickOutside);

      return () => {
        window.removeEventListener('click', onClickOutside);
      }

    }, [])

}

export default useClickOutside