/* Copyright (c) 2015 - 2017, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { ipcRenderer } from 'electron';
import { getInstalledApps } from '../../../util/apps';
import * as ErrorDialogActions from '../../../actions/errorDialogActions';

export const LOAD_APP = 'LOAD_APP';
export const RETRIEVE_INSTALLED_APPS = 'RETRIEVE_INSTALLED_APPS';
export const RETRIEVE_INSTALLED_APPS_SUCCESS = 'RETRIEVE_INSTALLED_APPS_SUCCESS';
export const RETRIEVE_INSTALLED_APPS_ERROR = 'RETRIEVE_INSTALLED_APPS_ERROR';

function loadAppAction(app) {
    return {
        type: LOAD_APP,
        app,
    };
}

function retrieveInstalledAppsAction() {
    return {
        type: RETRIEVE_INSTALLED_APPS,
    };
}

function retrieveInstalledAppsSuccess(apps) {
    return {
        type: RETRIEVE_INSTALLED_APPS_SUCCESS,
        apps,
    };
}

function retrieveInstalledAppsError() {
    return {
        type: RETRIEVE_INSTALLED_APPS_ERROR,
    };
}

export function retrieveInstalledApps() {
    return dispatch => {
        dispatch(retrieveInstalledAppsAction());
        try {
            const apps = getInstalledApps();
            dispatch(retrieveInstalledAppsSuccess(apps));
        } catch (error) {
            dispatch(retrieveInstalledAppsError());
            dispatch(ErrorDialogActions.showDialog(error.message));
        }
    };
}

export function loadApp(app) {
    return dispatch => {
        dispatch(loadAppAction(app));

        // The apps in state are Immutable Maps which cannot be sent over IPC.
        // Converting to plain JS object before sending to the main process.
        const appObj = app.toJS();
        ipcRenderer.send('open-app', appObj);
    };
}