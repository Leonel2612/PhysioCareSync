import React, { useState, useRef } from 'react';
import { Context } from '../store/appContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import SnackBarLogin from '../component/SnackBarLogin';
import '../../styles/ProfileSpecialist.css';
import Loader from '../component/Loader';


const ProfileSpecialist = () => {
    const snackRef = useRef(null);
    const snackBarType = {
        fail: "fail",
        success: "success",
    };
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const params = useParams();
    const [missingToken, setMissingToken] = useState(false);
    sessionStorage.setItem("payStatus", store.informationSpecialist.is_authorized);
    const payStatus = sessionStorage.getItem("payStatus");
    const [loading, setLoading] = useState(true)

    const checkAccess = async () => {
        await actions.accessConfirmationSpecialist();
        const token = sessionStorage.getItem('tokenSpecialist');

        if (!token && store.isTokenAuthentication == true) {
            setMissingToken(true);
            snackRef.current.show();
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
    };

    useEffect(() => {
        checkAccess();
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, []);




    const token = sessionStorage.getItem('tokenSpecialist');

    const specialistId = sessionStorage.getItem("specialistId")

    const { theid } = params


    const handlerReturn = () => {
        navigate(`/profile/paymentPage/${specialistId}`);
    };

    const handlerHome = () => {
        navigate('/');
    };

    const isAuthenticatedSpecialistId = store.informationSpecialist.length ? store.informationSpecialist.id : parseInt(theid);

    const profileImageEmpty = "https://res-console.cloudinary.com/dxgvkwunx/thumbnails/v1/image/upload/v1703884900/UGh5c2lvQ2FyZVN5bmMvaW1hZ2VuX3Npbl9mb25kb19lbmZlcm1lcm9faG95emVp/preview";
    const registerSpecialistDateUTC = new Date(store.informationSpecialist.created_at);
    const registerSpecialistLocalTime = registerSpecialistDateUTC.toLocaleString();
    const [registerDate] = registerSpecialistLocalTime.split(",");
    const handleInformationProfesional = store.informationSpecialist.is_physiotherapist == true ? "Fisioterapia" : "Enfermeria";

    return (
        loading
            ? <div>
                <Loader />
            </div>
            : (
                < div >
                    {
                        missingToken ?
                            <SnackBarLogin type={snackBarType.success
                            } ref={snackRef} message="Usted inicio sesión correctamente!" /> :
                            <SnackBarLogin type={snackBarType.fail} ref={snackRef} message="Intente nuevamente ingresando sus datos correctamente!" />
                    }


                    {
                        token && isAuthenticatedSpecialistId == specialistId && payStatus === "true" ? (
                            <div className='container-profile-specialist'>
                                <button className='edit-profile-button' onClick={() => navigate('/edit/formSpecialist')}>
                                    Editar el perfil
                                </button>
                                <br></br>
                                <div className='container-img-profile-specialist'>
                                    <img className='image-specialist' src={store.informationSpecialist.img ? store.informationSpecialist.img : profileImageEmpty} />
                                </div>
                                <div className='container-information-specialist'>
                                    <p className='name-specialist'>{store.informationSpecialist.first_name} {store.informationSpecialist.last_name}</p>
                                    <h5>Información personal</h5>
                                    <p className='isphysiotherapist-specialist'> Especialista en la rama de: {store.informationSpecialist.is_physiotherapist ? handleInformationProfesional : ""} </p>
                                    <p className='decription-specialist'> Breve Introducción del profesional en  {handleInformationProfesional}:  <br /> {store.informationSpecialist.description ? store.informationSpecialist.description : "En edición de perfil ingrese una breve descripción para que los clientes sepan un poco más de usted como profesional"} </p>


                                    <p className='language-specialist'> Idiomas conocidos: {store.informationSpecialist.language ? store.informationSpecialist.language : "En edición de perfil ingrese los idiomas que sabe hablar"} </p>
                                    <p className='country-origin-specialist'> País de origen: {store.informationSpecialist.country_origin ? store.informationSpecialist.country_origin : "En edición de perfil ingrese el pais donde nacio "}</p>
                                    <p className='phone-number-specialist'>Número de celular: {store.informationSpecialist.phone_number ? store.informationSpecialist.phone_number : "Aún no tiene guardado un número de celular, porfavor inserte uno para que pueda comunicarse con los pacientes"} </p>

                                    <h5>Información de la cuenta</h5>

                                    <p className='email-specialist'>Correo electrónico: {store.informationSpecialist.email} </p>

                                    <p className='date-register-specialist'> Fecha de registro en PhysioCareSync: {registerDate}</p>

                                </div>



                                <p className='certification-specialist'> Certificados del profesional en {handleInformationProfesional}:  <br />
                                    {store.informationSpecialist.certificates && store.informationSpecialist.certificates.length > 0 ?
                                        store.informationSpecialist.certificates.map(certificate => (
                                            <img key={certificate.id} src={certificate.certificates_url} className='image-certificate-specialist' />
                                        ))
                                        :
                                        <p className='text-no-certification' style={{ marginTop: "0.5%" }}> Aún no tienes agregado ningún certificado, agrega hasta cinco certificaciones para que tengas más posiblidades de ser escogido por pacientes!</p>
                                    }
                                </p>



                            </div>)

                            :
                            payStatus === "false" && token ?
                                (<div className='conditionalMsg'>
                                    <h1 className='headMsg'>Importante!</h1>
                                    <p>No se puede acceder a la información porque no se ha pagado la suscripción, por favor realiza tu pago.</p>
                                    <h2><i className="fa-solid fa-dollar-sign fa-beat-fade"></i></h2>
                                    <button onClick={handlerReturn} type="button" className="btn btn-primary">Ir a ventana de pago</button>
                                </div>)
                                :

                                (
                                    <div className='conditionalMsg'>
                                        <h1 className='headMsg'>Atención!</h1>
                                        <p>No puede acceder a la información porque la sesión ha expirado.</p>
                                        <button onClick={handlerHome} type="button" className="btn btn-primary">Ir a la página de inicio</button>
                                    </div>)


                    }
                </div >
            )

    );
};

export default ProfileSpecialist;