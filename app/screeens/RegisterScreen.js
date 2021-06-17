import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants'
import { RFPercentage } from 'react-native-responsive-fontsize';

import AppTextInput from '../components/AppTextInput';
import colors from '../config/colors';
import AppTextButton from '../components/AppTextButton';
import { addUser } from '../services/UserServices';
import Toast from 'toastify-react-native';
import AccountText from '../components/common/AccountText';

function RegisterScreen(props) {
    const [toastify, setToastify] = useState();
    const [indicator, setIndicator] = useState(false);

    const [feilds, setFeilds] = useState([
        {
            id: 0,
            placeHolder: "First name",
            value: '',
            secure: false
        },
        {
            id: 1,
            placeHolder: "Last name",
            value: '',
            secure: false
        },
        {
            id: 2,
            placeHolder: "email",
            value: '',
            secure: false
        },
        {
            id: 3,
            placeHolder: "Password",
            value: '',
            secure: true
        },
        {
            id: 4,
            placeHolder: "Confirm password",
            value: '',
            secure: true
        },
    ]);

    const handleChange = (text, id) => {
        const tempFeilds = [...feilds];
        tempFeilds[id].value = text;
        setFeilds(tempFeilds);
    }

    const handleSubmit = async () => {
        const highestTimeoutId = setTimeout(() => ';');
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }

        const body = {
            name: `${feilds[0].value.trim()} ${feilds[1].value.trim()}`,
            email: feilds[2].value.trim().toLowerCase(),
            password: feilds[3].value.trim()
        }

        if (body.password !== feilds[4].value) {
            toastify.error("Check Password and Confirm Password");
            return;
        }

        if (body.name === '' || body.email === '' || body.password === '') {
            toastify.error("Please fill all the feilds");
            return;
        }

        setIndicator(true);

        try {
            const res = await addUser(body);
            if (!res) {
                toastify.error("Registration Failed");
                setIndicator(false);
                return;
            }

            setIndicator(false);
            toastify.success("Registration Successful");

            setTimeout(() => {
                props.navigation.navigate('loginScreen')
            }, 2000)

        } catch (error) {
            toastify.error("Registration Failed");
            setIndicator(false);
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar position="bottom" style="light" backgroundColor={colors.primary} />

            <Toast style={{ fontSize: 10 }} ref={(t) => setToastify(t)} />
            {/* Kitchen buddy top container */}
            <View style={{ backgroundColor: colors.primary, flex: 0.6, width: "100%", flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                <Text style={{ marginBottom: RFPercentage(5), color: colors.white, fontSize: Platform.OS === "ios" ? RFPercentage(4) : RFPercentage(6.5) }} >Sign Up</Text>
            </View>

            {indicator
                ? <View style={{ marginTop: -RFPercentage(7), borderTopLeftRadius: RFPercentage(8), backgroundColor: colors.lightGrey, width: "100%", flex: 1.8, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                    <ActivityIndicator color={colors.primary} size={RFPercentage(6)} />
                </View>
                : <>
                    {/* Bottom Contaienr */}
                    <View style={{ marginTop: -RFPercentage(7), borderTopLeftRadius: RFPercentage(8), backgroundColor: colors.lightGrey, width: "100%", flex: 1.8, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >
                        {/* Text feilds */}
                        {feilds.map((item, i) =>
                            <View key={i} style={{ marginTop: i == 0 ? RFPercentage(10) : RFPercentage(4), width: "85%" }} >
                                <AppTextInput
                                    placeHolder={item.placeHolder}
                                    width="100%"
                                    value={item.value}
                                    onChange={(text) => handleChange(text, item.id)}
                                    secure={item.secure}
                                />
                            </View>
                        )}

                        {/* SignUp button */}
                        <View style={{ marginTop: RFPercentage(5), width: "85%", flex: 1, alignItems: "flex-end" }} >
                            <AppTextButton
                                name="Sign Up"
                                borderRadius={RFPercentage(1.3)}
                                onSubmit={() => handleSubmit()}
                                backgroundColor={colors.primary}
                                width="100%"
                                height={RFPercentage(5.5)}
                            />
                        </View>

                    </View>

                    {/* Signup text */}
                    <AccountText navigate={props.navigation.navigate} description="Already have an account? " buttnText="Sign In" location="loginScreen" />
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: Constants.statusBarHeight,
        flex: 1,
        backgroundColor: colors.lightGrey,
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%"
    },
})

export default RegisterScreen;