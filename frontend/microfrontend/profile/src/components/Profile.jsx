import React, { useState } from 'react';
import api from "../utils/api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import "../blocks/profile/profile.css";

function Profile() {
    const [currentUser, setCurrentUser] = useState({});
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);

    // Запрос к API за информацией о пользователе и массиве карточек выполняется единожды, при монтировании.
    React.useEffect(() => {
        api
        .getUserInfo()
        .then((userData) => {
            setCurrentUser(userData);
            dispatchEvent(new CustomEvent("profile-change", {
                detail: {
                  profile: userData
                }
            }));
        })
        .catch((err) => console.log(err));
    }, []);

    function handleUpdateUser(userUpdate) {
        api
        .setUserInfo(userUpdate)
        .then((newUserData) => {
            setCurrentUser(newUserData);
            setIsEditProfilePopupOpen(false);
        })
        .catch((err) => console.log(err));
    }

    function handleUpdateAvatar(avatarUpdate) {
        api
        .setUserAvatar(avatarUpdate)
        .then((newUserData) => {
            setCurrentUser(newUserData);
            setIsEditAvatarPopupOpen(false);
        })
        .catch((err) => console.log(err));
    }      

    return (
        <section className="profile page__section">
            <EditProfilePopup
                currentUser={currentUser}
                isOpen={isEditProfilePopupOpen}
                onUpdateUser={handleUpdateUser}
                onClose={() => setIsEditProfilePopupOpen(false)}
            />
            <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onUpdateAvatar={handleUpdateAvatar}
                onClose={() => setIsEditAvatarPopupOpen(false)}
            />
            <div className="profile__image" onClick={() => setIsEditAvatarPopupOpen(true)} style={{ backgroundImage: `url(${currentUser.avatar})` }}></div>
            <div className="profile__info">
                <h1 className="profile__title">{currentUser.name}</h1>
                <button className="profile__edit-button" type="button" onClick={() => setIsEditProfilePopupOpen(true)}></button>
                <p className="profile__description">{currentUser.about}</p>
            </div>
        </section>
    );
}

export default Profile;