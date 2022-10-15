import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {createContext, useEffect, useState} from 'react';
import {BASE_URL} from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [userInfo, setUserInfo] = useState({});
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);

    const register = async (name, email, password) => {
        setIsLoading(true);
        axios.post(`${BASE_URL}/auth/register`, {
            name,
            email,
            password,
        })
            .then(res => {
                let userInfo = res.data;
                setUserInfo(userInfo);
                AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                setIsLoading(false);
                console.log(userInfo);
            })
            .catch(e => {
                console.log(`register error ${e}`);
                setIsLoading(false);
            });
    };

    const login = async (email, password) => {
        setIsLoading(true);
        axios.post(`${BASE_URL}/auth/login`, {
            email,
            password,
        })
            .then(res => {
                let userInfo = res.data;
                console.log(userInfo);
                setUserInfo(userInfo);
                const token = userInfo.data.token.accessToken;
                setToken(token);
                AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                AsyncStorage.setItem('token', token);
                setIsLoading(false);
            })
            .catch(e => {
                console.log(`login error ${e}`);
                setIsLoading(false);
            });
    };

    const logout = async () => {
        setIsLoading(true);
        axios.get(
            `${BASE_URL}/auth/logout`,
            {
                headers: {Authorization: `Bearer ${userInfo.data.token.accessToken}`},
            }
        )
            .then(res => {
                console.log(res.data);
                AsyncStorage.removeItem('userInfo');
                AsyncStorage.removeItem('token');
                setUserInfo({});
                setIsLoading(false);
            })
            .catch(e => {
                console.log(`logout error ${e}`);
                setIsLoading(false);
            });
    };

    const isLoggedIn = async () => {
        try {
            setSplashLoading(true);
            let userInfo = await AsyncStorage.getItem('token');
            if (userInfo) {
                setUserInfo(userInfo);
            }
            setSplashLoading(false);
        } catch (e) {
            setSplashLoading(false);
            console.log(`is logged in error ${e}`);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userInfo,
                splashLoading,
                register,
                login,
                logout,
                token
            }}>
            {children}
        </AuthContext.Provider>
    );
};
