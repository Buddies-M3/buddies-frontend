import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, AuthErrorCodes, sendEmailVerification, signInWithCustomToken, sendPasswordResetEmail, signOut } from "firebase/auth";
import { ethers } from 'ethers';

import firebaseApp from "utils/firebase";

import admin from "utils/firebase-admin";
import userApi from "utils/__api__/users";

import { USER_TOKEN } from "utils/cookies-utils";
import { add } from "lodash";

export async function POST(request, { params }) {
    const formData = await request.formData();
    const slug = params.slug;
    const auth = getAuth(firebaseApp);

    console.log("slug: ", slug);

    switch (slug) {
        case "login": {
            const email = formData.get('email');
            const password = formData.get('password');

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const token = await userCredential.user.getIdToken();
                const uid = userCredential.user.uid;

                if (token) {
                    if (userCredential.user.emailVerified) {
                        return new Response(JSON.stringify({ status: "success", token: token, uid: uid}), {
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                    } else {
                        await sendEmailVerification(userCredential.user);
                        return new Response(JSON.stringify({ status: "not_verified", token: token, uid: uid }), {
                            status: 401,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                    }

                } else {
                    return new Response(JSON.stringify({ status: "failed" }), {
                        status: 400,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
            } catch (error) {
                console.error('Error during login:', error);
                return new Response(JSON.stringify({ status: "error", message: error.message }), {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
        }
        case "verify": {
            console.log("verify");
            const token = formData.get('token');
            try {
                console.log("Token: ", token);
                const decodedToken = await admin.auth().verifyIdToken(token);
                const verifiedUid = decodedToken.uid;

                console.log("Decoded token: ", decodedToken);

                if (verifiedUid) {
                    const userRecord = await admin.auth().getUser(verifiedUid);
                    if (userRecord.emailVerified) {
                        return new Response(JSON.stringify({ status: "success", uid: verifiedUid }), {
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                    } else {
                        return new Response(JSON.stringify({ status: "not_verified", message: "Email is not verified", email: userRecord.email }), {
                            status: 401,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                    }
                } else {
                    return new Response(JSON.stringify({ status: "failed", message: "Invalid user" }), {
                        status: 400,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
            } catch (error) {
                console.error('Error during token verification:', error);
                return new Response(JSON.stringify({ status: "error", message: error.message }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
        }

        case "resend-verify-email": {
            const token = formData.get('token');
            console.log(token);
            try {
                const userCredential = await signInWithCustomToken(auth, token);

                if (userCredential.user) {
                    // Resend verification email
                    await sendEmailVerification(auth, userCredential.user);

                    return new Response(JSON.stringify({ status: "success", message: "Verification email resent" }), {
                        status: 200,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                } else {
                    // Unable to sign in user with custom token
                    return new Response(JSON.stringify({ status: "failed", message: "Invalid user" }), {
                        status: 400,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
            } catch (error) {
                console.error('Error during sign in with custom token:', error);
                return new Response(JSON.stringify({ status: "error", message: error.message }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
        }

        case "reset-password": {
            const email = formData.get('email');
            try {
                // Send password reset email
                await sendPasswordResetEmail(auth, email);

                return new Response(JSON.stringify({ status: "success", message: "Password reset email resent" }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                console.error('Error sending password reset email:', error);
                return new Response(JSON.stringify({ status: "success", message: "Error sending password reset email" }), {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
        }

        case "register": {
            const userName = formData.get('fullname');
            const userEmail = formData.get('email');
            const userPassword = formData.get('password');

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
                const token = await userCredential.user.getIdToken();
                const uid = userCredential.user.uid;

                if (userCredential) {
                    return new Response(JSON.stringify({ status: "success", token: token, uid: uid}), {
                        status: 200,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                } else {
                    return new Response(JSON.stringify({ status: "failed" }), {
                        status: 500,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
            } catch (error) {
                console.error('Error during register:', error);
                if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
                    return new Response(JSON.stringify({ status: "exist", message: error.code }), {
                        status: 409,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
                return new Response(JSON.stringify({ status: "error", message: error.message }), {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
        }

        case "logout": {
            try {
                await signOut(auth);
                return new Response(JSON.stringify({ status: "success", message: "Successfully signed out" }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Set-Cookie': `${USER_TOKEN}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
                    }
                });

            } catch {
                return new Response(JSON.stringify({ status: "error", message: error.message }), {
                    status: 501,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
        }

        default:
            return new Response(JSON.stringify({ status: "error", message: "Not implemented" }), {
                status: 503,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    }
}