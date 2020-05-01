import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from "react-icons/fi";

import logoImg from '../../assets/logo.svg';

import api from '../../services/api';
import './styles.css';

export default function Profile() {
  const id = localStorage.getItem('ongId');

  const [incidents, setIncidents] = useState([]);
  const [ongName, setOngName] = useState('<ong name>');
  const [ongId, setOngId] = useState('');

  const history = useHistory();

  function setLogout() {
    localStorage.removeItem('ongId');
    localStorage.removeItem('ongName');

    history.push('/');
  }

  async function handleDelete (id) {
    try {
      await api.delete(`incidents/${id}`, {
        headers: { Authorization: ongId }
      });

      setIncidents(incidents.filter(incident => incident.id !== id));
    } catch (error) {
      console.log('Erro ao deletar caso, tente novamente.', error.response.data);
      alert('Erro ao deletar caso, tente novamente.');
    }
  }

  function handleLogout (event) {
    event.preventDefault();

    setLogout();
  }

  if (id) {
    setOngName(localStorage.getItem('ongName'));
    setOngId(id);
  } else {
    setLogout();
  }

  useEffect(() => {
    api.get('profiles', {
      headers: { Authorization: ongId }
    }).then((response) => {
      setIncidents(response.data);
    });
  }, [ongId]);

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be The Hero"/>
        <span>Bem vinda, {ongName}</span>

        <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
        <button type="button" onClick={handleLogout}>
          <FiPower size={18} color="#E02041" />
        </button>
      </header>

      <h1>Casos cadastrados</h1>

      <ul>
        { incidents.map(incident => (
          <li key={incident.id}>
            <strong>CASO: </strong>
            <p>{ incident.title }</p>

            <strong>DESCRIÇÃO: </strong>
            <p>{ incident.description }</p>

            <strong>VALOR: </strong>
            <p>{ Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value) }</p>

            <button type="button" onClick={() => handleDelete(incident.id)}>
              <FiTrash2 size={20} color="#A8A8B3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
