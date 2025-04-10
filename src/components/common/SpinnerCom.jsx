import waitImg from '../../img/waiting2.gif'

const SpinnerCom = () => {
  return (
    <div className='fixed inset-0 flex z-50 items-center justify-center bg-black bg-opacity-50'>
      <img
        className='max-w-[100px] inline-block'
        src={waitImg}
        alt='Cargando...'
      />
    </div>
  )
}

export default SpinnerCom
