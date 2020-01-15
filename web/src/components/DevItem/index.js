import React, { useState } from 'react';
import api from '../../services/api';
import './styles.css'

import alertify from 'alertifyjs';

function DevItem({ dev }) {
    const [name, setName] = useState('');
    const [techs, setTechs] = useState('');
    const [bio, setBio] = useState('');

    async function handleDelete(dev) {
        alertify.confirm('Confirmar exclusão', `Tem certeza que quer excluir ${dev.name}?`,
            async () => {
                await api.delete('/devs/' + dev._id);
                window.location.reload();
            }, () => {
                alertify.error('Exclusão cancelada');
            });
    }

    async function handleUpdate(dev) {
       /* fazer o campo para editar
        alertify.prompt('Editar Dev', 'Prompt Message', 'Prompt Value',
            (evt, value) => {
                alertify.success('You entered: ' + value)
            }, () => {
                alertify.error('Edição cancelada')
            });
        const params = {

        }
        */
    }

    return (
        <li className="dev-item">
            <header>
                <img src={dev.avatar_url} alt={dev.name} />
                <div className="user-info">
                    <div className="button-list">
                        <button onClick={() => handleUpdate(dev)} id="edit">Editar</button>
                        <button onClick={() => handleDelete(dev)} id="delete">Excluir</button>
                    </div>
                    <strong>{dev.name}</strong>
                    <span>{dev.techs.join(', ')}</span>
                </div>
            </header>
            <p>{dev.bio}</p>
            <a href={`https://github.com/${dev.github_username}`}>Acessar perfil no Github</a>
        </li>
    );
}

export default DevItem;