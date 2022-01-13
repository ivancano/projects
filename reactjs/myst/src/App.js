import React from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AuthProvider from './providers/AuthProvider';
import ProtectedRoute from './router/ProtectedRoute';
import UnprotectedRoute from './router/UnprotectedRoute';
import ProtectedPaymentRoute from './router/ProtectedPaymentRoute';
import Login from './screens/Login/index';
import SignUp from './screens/SignUp/index';
import SignUpSuccess from './screens/SignUp/success';
import RecoveryPassword from './screens/RecoveryPassword/index';
import ListMovies from './screens/Movies/listMovies';
import DetailMovie from './screens/Movies/detailMovie';
import ListSeries from './screens/Series/listSeries';
import DetailSerie from './screens/Series/detailSerie';
import ListAudios from './screens/Audios/listAudios';
import DetailAudio from './screens/Audios/detailAudio';
import PlayerComponent from './screens/Player/index';
import Account from './screens/Account/index';
import Subscription from './screens/Subscription/index';
import SubscriptionCreditCard from './screens/Subscription/creditcard';
import NotFound from './screens/NotFound/index';

class App extends React.Component {
  

  render() {
      return (
        <Router>
          <AuthProvider>
            <Switch>
            	<Route path="/" exact component={ListMovies} />
              	<Route path="/movies" component={ListMovies} />
              	<Route path="/movie/:id" component={DetailMovie} />
              	<Route path="/series" component={ListSeries} />
              	<Route path="/serie/:id" component={DetailSerie} />
              	<Route path="/audios" component={ListAudios} />
              	<Route path="/audio/:id" component={DetailAudio} />
              	<ProtectedPaymentRoute path="/player/movie/:id" exact component={PlayerComponent} />
              	<ProtectedPaymentRoute path="/player/serie/:id/episode/:episode" exact component={PlayerComponent} />
              	<ProtectedPaymentRoute path="/player/audio/:id" exact component={PlayerComponent} />
              	<UnprotectedRoute path="/login" component={Login} />
              	<UnprotectedRoute path="/sign-up" component={SignUp} />
              	<ProtectedRoute path="/success" component={SignUpSuccess} />
              	<UnprotectedRoute path="/recovery-password" component={RecoveryPassword} />
              	<ProtectedRoute path="/account" component={Account} />
              	<ProtectedRoute path="/subscription" exact component={Subscription} />
              	<ProtectedRoute path="/subscription/:type" component={SubscriptionCreditCard} />
              	<Route path="/404" component={NotFound} />
              	<Route component={NotFound} />
            </Switch>
          </AuthProvider>
        </Router>
      );
  }
}

export default App;
