import React, { useState, useContext, useEffect, useCallBack, Fragment } from 'react';
import { render } from 'react-dom';

import LoginFormIndex from './components/LoginFormIndex.jsx'

const main = document.querySelectorAll('main')[0]

render(<LoginFormIndex/>, main)