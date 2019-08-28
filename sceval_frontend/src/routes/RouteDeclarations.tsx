import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { LeftNav } from '../components/LeftNav';
import { Login, ResetPassword, Register, Hardware, 
  EmailSent, MyAccount, AddSensorModule, SensorModule } from '../containers/index';
export interface RouteDeclarationsProps {
  isSavedLoginPresent: boolean;
  isLoggedIn: boolean;
  isAuthenticated: boolean;
  onLogin: () => void;
}

export enum RouteKeys {
  Home,
  Login,
  Register,
  ResetPassword,
  Settings,
  EmailSent,
  EmailLogin,
  EmailResetPassword,
  EmailRegister,
  MyAccount,
  Devices,
  SensorModules,
  AddSensorModule,
}
export interface RouteParams {
  deviceId?: string;
  sensorModuleId?: string;
}

export default class RouteDeclarations extends React.Component<RouteDeclarationsProps, any> {
  render() {
    return [
      (
        <Route
          key={RouteKeys.Home}
          exact={true}
          path="/"
          component={() => (
            <Redirect to="/login" />
          )}
        />
      ),
      (
        <Route
          key={RouteKeys.Login}
          exact={true}
          path="/login"
          component={() => (
            <>
              <Login
                isLoggedIn={this.props.isLoggedIn}
                onLogIn={this.props.onLogin}
              />
            </>
          )}
        />
      ),
      (
        <Route
          key={RouteKeys.ResetPassword}
          exact={true}
          path="/reset_password"
          component={() => (
            <>
              <ResetPassword />
            </>
          )}
        />
      ),
      (
        <Route
          key={RouteKeys.Register}
          exact={true}
          path="/register"
          component={() => (
            <>
              <Register
                isLoggedIn={this.props.isLoggedIn}
                onLogIn={this.props.onLogin}
              />
            </>
          )}
        />
      ),
      (
        <Route
          key={RouteKeys.EmailSent}
          exact={true}
          path="/email_sent"
          component={() => (
            <>
              <EmailSent />
            </>
          )}
        />
      ),
      (
        <Route
          key={RouteKeys.Devices}
          exact={true}
          path="/devices"
          component={() => (
            <>
              <Hardware
                isLoggedIn={this.props.isLoggedIn}
                onLogIn={this.props.onLogin}
              />
            </>
          )}
        />
      ),
      (
        <Route
          key={RouteKeys.MyAccount}
          exact={true}
          path="/my_account"
          component={() => (
            <>
              <MyAccount
                isLoggedIn={this.props.isLoggedIn}
                onLogIn={this.props.onLogin}
              />
            </>
          )}
        />
      ),
      (
        <Route
          key={RouteKeys.SensorModules}
          exact={true}
          path="/sensor_modules/:sensorModuleId"
          component={() => (
            <>
              <LeftNav />
              <SensorModule
                isLoggedIn={this.props.isLoggedIn}
              />
            </>
          )}
        />
      ),
      (
        <Route
          key={RouteKeys.AddSensorModule}
          exact={true}
          path="/devices/:deviceId/add_sensor_modules"
          component={() => (
            <>
              <AddSensorModule
                isLoggedIn={this.props.isLoggedIn}
                onLogIn={this.props.onLogin}
              />
            </>
          )}
        />
      )
    ];
  }
}