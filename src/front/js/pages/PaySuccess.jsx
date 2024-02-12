import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context } from '../store/appContext';

const PaySuccess = () => {
  const navigate = useNavigate()
  const { store, actions } = useContext(Context)
  const specialistId = sessionStorage.getItem("specialistId")

  const handlerProfile = async () => {
    navigate(`/profile/specialist/${specialistId}`)
  }
  const authorizePayment = async () => {
    const result = await actions.authorizeSpacialist(specialistId)
    store.informationSpecialist = result.specialist_information
  }
  useEffect(() => {
    authorizePayment();

  }, [])


  return (
    <div className="patientForm">
      <div className="title">
        <h1>Bienvenido especialista!</h1>
        <p className="subTitle">Tu pago fue concretado correctmente, por favor presiona el botón para ir a tu perfil</p>
      </div>
      <button onClick={handlerProfile} type="button" className="btn btn-primary">Períl</button>
    </div>

  )
}

export default PaySuccess