import React, { useContext, useRef, useState } from 'react';
import { Context } from '../store/appContext';
import { useNavigate, Link } from 'react-router-dom';
import zxcvbn from 'zxcvbn';
import '../../styles/NewSpecialist.css'; 
import SnackBarLogin from '../component/SnackBarLogin';
import Footer from '../component/footer';

const NewSpecialist = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPhysio, setIsPhysio] = useState(false);
  const [isNurse, setIsNurse] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Estados de dinamización
  const [clickedFirstName, setClickedFirstName] = useState(false);
  const [clickedLastName, setClickedLastName] = useState(false);
  const [clickedEmail, setClickedEmail] = useState(false);
  const [clickedPassword, setClickedPassword] = useState(false);
  const [enableButtons,setEnableButtons]=useState(false)


  // Estado de fortaleza de contraseña
  const [passwordStrength, setPasswordStrength] = useState({ score: 0 });

  // Funciones de dinamización de inputs
  const handlerClickFirstName = () => {
    setClickedFirstName(false);
  };

  const handlerBlurFirstName = () => {
    if (!firstName.trim()) {
      setClickedFirstName(true);
    }
  };

  const handlerClickLastName = () => {
    setClickedLastName(false);
  };

  const handlerBlurLastName = () => {
    if (!lastName.trim()) {
      setClickedLastName(true);
    }
  };

  const handlerClickEmail = () => {
    setClickedEmail(false);
  };

  const handlerBlurEmail = () => {
    if (!email.trim()) {
      setClickedEmail(true);
    } else if (!isEmailValid(email)) {
      setClickedEmail(true);
    }
  };

  const handlerClickPassword = () => {
    setClickedPassword(false);
  };

  const handlerBlurPassword = () => {
    if (!password.trim()) {
      setClickedPassword(true);
    }
  };

// Actualiza la fortaleza de la contraseña mientras el usuario la escribe
const handlerChangePassword = (e) => {
  const newPassword = e.target.value;
  setPassword(newPassword);
  checkPasswordStrength(newPassword);
};

  // Comprobación de fortaleza de contraseña
  const checkPasswordStrength = (password) => {
    const strength = zxcvbn(password);
    const score = strength.score;
  
    // Asegúrate de que la puntuación esté en el rango de 0 a 4
    const adjustedScore = Math.min(Math.max(score, 0), 4);
    setPasswordStrength({ score: adjustedScore, feedback: strength.feedback });
  };

  // Validación del formato del correo electrónico
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Funciones de dinamización de botones
  const handlerPhysioChange = async () => {
    setIsPhysio(true);
    setIsNurse(false);
  };

  const handlerNurseChange = async () => {
    setIsNurse(true);
    setIsPhysio(false);
  };

  // Función para crear el especialista
  const handlerCreateSpecialist = async () => {
    try {
      setEnableButtons(true)
      if (
        firstName === '' ||
        lastName === '' ||
        email === '' ||
        password === '' ||
        !isEmailValid(email)
      ) {
        snackRef.current.show();
        setTimeout(()=>{
          setEnableButtons(false)
        },2000)

        return;
      }

      let newInputSpecialist = {
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName,
        is_physiotherapist: isPhysio,
        is_nurse: isNurse,
        certificate: null,
        description: null,
        language: null,
      };
      const result =  await actions.createNewSpecialist(newInputSpecialist);
      if(result.specialist_id){
        setSignupSuccess(true)
        snackRef.current.show()
        setTimeout(() => {
          setEnableButtons(false)
          navigate('/login/loginSpecialist');
        }, 3000)
      }else if(result.error){
        console.log(result.error)
        snackRef.current.show();
        setEnableButtons(false)
        return;
      }
    } catch (error) {
      setEnableButtons(false)
      console.error(error);
    }
  };

  const snackRef = useRef(null)
  const snackBarType = {
      fail: "fail",
      success: "success"
  }

  return (
    <div>{signupSuccess ?
      <SnackBarLogin type={snackBarType.success} ref={snackRef} message="El usuario especialista se ha creado correctamente" /> :
      <SnackBarLogin type={snackBarType.fail} ref={snackRef} message="No se puede crear el usuario especialista correctamente" />}
    <div className='patientForm'>
      <div className='title'>
        <h1>Bienvenido especialista!</h1>
        <p className='subTitle'>Por favor, introduce tus datos para registrarte</p>
      </div>

      <div className="mb-3">
        <input
          onChange={(e) => setFirstName(e.target.value)}
          onClick={handlerClickFirstName}
          onBlur={handlerBlurFirstName}
          type="firstName"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="Nombre"
        />
        {clickedFirstName && <p className='errorMsg'>* El nombre es obligatorio *</p>}
      </div>

      <div className="mb-3">
        <input
          onChange={(e) => setLastName(e.target.value)}
          onClick={handlerClickLastName}
          onBlur={handlerBlurLastName}
          type="lastName"
          className="form-control"
          id="exampleFormControlInput2"
          placeholder="Apellido"
        />
        {clickedLastName && <p className='errorMsg'>* El apellido es obligatorio *</p>}
      </div>

      <div className="mb-3">
        <input
          onChange={(e) => setEmail(e.target.value)}
          onClick={handlerClickEmail}
          onBlur={handlerBlurEmail}
          type="email"
          className="form-control"
          id="exampleFormControlInput3"
          placeholder="Correo electrónico"
        />
        {clickedEmail && <p className='errorMsg'>* El correo electrónico es obligatorio *</p>}
      </div>

      <div>
      <input
          onChange={handlerChangePassword}
          onClick={handlerClickPassword}
          onBlur={handlerBlurPassword}
          placeholder='Contraseña'
          type="password"
          id="inputPassword5"
          className="form-control" 
          aria-describedby="passwordHelpBlock"
        />
        <div id="passwordHelpBlock" className="form-text">
          {passwordStrength.feedback && (
            <div>
              <div className={`password-strength-${passwordStrength.score}`}>
                {passwordStrength.feedback.suggestions.join(' ')}
              </div>
              <progress
                className={`progress password-strength-${passwordStrength.score}`}
                value={passwordStrength.score + 1}
                max="4"
              />
            </div>
          )}
        </div>
      </div>

      <div className='speciality'>
        <div className="form-check form-check-inline">
          <input onChange={handlerPhysioChange} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
          <label className="form-check-label" htmlFor="inlineRadio1">Fisioterapeuta</label>
        </div>
        <div className="form-check form-check-inline">
          <input onChange={handlerNurseChange} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" />
          <label className="form-check-label" htmlFor="inlineRadio2">Enfermero/a</label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" disabled />
          <label className="form-check-label" htmlFor="inlineRadio3">Psicólogo (Próximamente)</label>
        </div>
      </div>
      <br />

      <div className='createNewBtn'>
        <button onClick={handlerCreateSpecialist} disabled={enableButtons} type="button" className="btn btn-success">
          Crear
        </button>
          <button type="button" disabled={enableButtons} onClick={()=>navigate('/signup')} className="btn btn-outline-primary exitBtn">
            Salir
          </button>
      </div>
    </div>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>

    <Footer/>
    </div>
  );
};

export default NewSpecialist;