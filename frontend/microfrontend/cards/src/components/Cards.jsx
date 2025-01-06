import React, { useState } from 'react';
import api from "../utils/api";
import Card from './Card';
import ImagePopup from './ImagePopup';
import AddPlacePopup from './AddPlacePopup';
import "../blocks/places/places.css";

function Cards({ currentUser }) {
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [cards, setCards] = useState([]);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);

    React.useEffect(() => {
        api
          .getCardList()
          .then((cardData) => {
            setCards(cardData);
          })
          .catch((err) => console.log(err));
      }, []);

    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i._id === currentUser._id);
            api
                .changeLikeCardStatus(card._id, !isLiked)
                .then((newCard) => {
                setCards((cards) =>
                    cards.map((c) => (c._id === card._id ? newCard : c))
                );
                })
                .catch((err) => console.log(err));
    }

    function handleCardDelete(card) {
        api
          .removeCard(card._id)
          .then(() => {
            setCards((cards) => cards.filter((c) => c._id !== card._id));
          })
          .catch((err) => console.log(err));
      }

    function handleAddPlaceSubmit(newCard) {
        api
            .addCard(newCard)
            .then((newCardFull) => {
                setCards([newCardFull, ...cards]);
                setIsAddPlacePopupOpen(false);
            })
            .catch((err) => console.log(err));
    }      

    return (
        <div>
            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onAddPlace={handleAddPlaceSubmit}
                onClose={() => setIsAddPlacePopupOpen(false)}
            />
            <ImagePopup card={selectedCard} onClose={() => setSelectedCard(null)} />
            <section className="places page__section">
                <button className="profile__add-button" type="button" onClick={() => setIsAddPlacePopupOpen(true)}></button>
                <ul className="places__list">
                    {cards.map((card) => (
                        <Card
                            key={card._id}
                            currentUser={currentUser}
                            card={card}
                            onCardClick={(c) => setSelectedCard(c)}
                            onCardLike={handleCardLike}
                            onCardDelete={handleCardDelete}
                        />
                    ))}
                </ul>
            </section>            
        </div>
    );
}

export default Cards;
