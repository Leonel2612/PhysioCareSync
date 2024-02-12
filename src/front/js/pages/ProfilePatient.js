import React from 'react'
import { Context } from '../store/appContext'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react'
import '../../styles/ProfilePatient.css';
import Loader from '../component/Loader';

const ProfilePatient = () => {

  const { store, actions } = useContext(Context)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)

  const params = useParams()

  const checkAccess = async () => {
    await actions.accessConfirmationPatient();
    const token = sessionStorage.getItem('tokenPatient');
    if (!token && store.isTokenAuthentication == true) {
      navigate('/');
    }
  };

  useEffect(() => {
    checkAccess();

    setTimeout(() => {
      setLoading(false)
    }, 3000)

  }, [])



  const token = sessionStorage.getItem('tokenPatient');
  const patientId = sessionStorage.getItem("patientId")
  const { theid } = params




  const isAuthenticatedPatientId = store.informationPatient.length ? store.informationPatient.id : parseInt(theid)

  const profileImageEmpty = "https://res.cloudinary.com/dxgvkwunx/image/upload/v1703777652/PhysioCareSync/imagen_sin_todo_perfil_ajw2oh.jpg"
  const registerPatientDateUTC = new Date(store.informationPatient.created_at)
  const registerPatientLocalTime = registerPatientDateUTC.toLocaleString()
  const [registerDate] = registerPatientLocalTime.split(",")

  return (
    loading ?
      <Loader />
      :

      <div>
        {
          token && isAuthenticatedPatientId == patientId ? (
            <div className='container-profile-patient'>
              <div className='container-img-profile-patient'>
                <img className='image-patient' src={store.informationPatient.img ? store.informationPatient.img : profileImageEmpty} />
              </div>
              <div className='container-information-patient'>
                <p className='name-patient'>{store.informationPatient.first_name} {store.informationPatient.last_name}</p>
                <h5>Información personal</h5>
                <p className='language-patient'> Idiomas conocidos: {store.informationPatient.language ? store.informationPatient.language : "En edición de perfil ingrese los idiomas que sabe hablar"} </p>
                <p className='country-origin-patient'> País de origen: {store.informationPatient.country_origin ? store.informationPatient.country_origin : "En edición de perfil ingrese el pais donde nacio "}</p>
                <p className='phone-number-patient'>Número de celular: {store.informationPatient.phone_number ? store.informationPatient.phone_number : "Aún no tiene guardado un número de celular, porfavor inserte uno."} </p>
                <h5>Información de la cuenta</h5>
                <p className='email-patient'>Correo electrónico: {store.informationPatient.email} </p>
                <p className='date-register-patient'> Fecha de registro en PhysioCareSync: {registerDate}</p>
                <div className='container-profile-specialist'>
                  <button
                    className='edit-profile-button'
                    onClick={() => navigate('/edit/patient')}>
                    Editar el perfil
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h1>No puede acceder a la información porque no existe un inicio de sesión</h1>
            </div>
          )
        }
      </div >
  );
};

export default ProfilePatient;