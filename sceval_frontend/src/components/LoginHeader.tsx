import React from 'react';
const modeLogo = require('../common_images/mode-logo-dark.svg');

export default function LoginHeader() {
    return (
        <div className="login-header">
            <img src={modeLogo} className="login-mode-logo" />
            <h1 className="title">MODE SENSOR CLOUD</h1>
            <hr />
        </div>
    );
}