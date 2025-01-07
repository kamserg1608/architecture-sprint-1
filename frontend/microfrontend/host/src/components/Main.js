import React, {lazy} from 'react';

const Profile = lazy(() => import('profile/Profile').catch(() => {
    return { default: () => <div className='error'>Component Profile is not available!</div> };
}));

const Cards = lazy(() => import('cards/Cards').catch(() => {
    return { default: () => <div className='error'>Component Cards is not available!</div> };
}));

function Main({ currentUser }) {
  return (
    <main className="content">
      <Profile/>
      <Cards
        currentUser={currentUser}
      />
    </main>
  );
}

export default Main;
