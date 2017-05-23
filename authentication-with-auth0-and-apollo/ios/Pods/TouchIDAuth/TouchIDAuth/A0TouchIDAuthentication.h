// A0TouchIDAuth.h
//
// Copyright (c) 2015 Auth0 (http://auth0.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^A0RegisterCompletionBlock)();
typedef void(^A0ErrorBlock)(NSError *error);

typedef NS_ENUM(NSInteger, A0TouchIDAuthenticationError) {
    A0TouchIDAuthenticationErrorTouchIDNotAvailable = -1,
    A0TouchIDAuthenticationErrorTouchIDFailed,
};

FOUNDATION_EXPORT NSString * const A0TouchIDAuthenticationErrorKey;

/**
 `A0TouchIDAuth` performs a passwordless authentication using `JWT` and *Apple's TouchID*.

 It has the following steps:

 1. RSA KeyPair generation.
 2. Registration of Public Key.
 3. Generate and Sign JWT in the device.
 4. Authenticate user with generated JWT.

 The first two steps are only performed if no KeyPair is found in the iOS Keychain. And every time `A0TouchIDAuth` needs to access the KeyPair, it will validate if the user is the owner of the device using TouchID. The steps #2 and #4 must be implemented by developer using callbacks.

 There are three callbacks, `registerPublicKey`, `jwtPayload` and `authenticate`.

 The callback `registerPublicKey` will handle the registration of the public key against an API and must call `completionBlock` on success in order to continue with the flow (or `errorBlock` if it fails).

 The callback `jwtPayload` is called before generating the JWT in order to provide the JWT payload needed by your API endpoint.

 The callback `authenticate` will receive the signed JWT and will need to authenticate against your API endpoint.
*/
@interface A0TouchIDAuthentication : NSObject

/**
 *  Block to handle public key registration with an API Endpoint. It will receive 3 parameters: publicKey, completionBlock and errorBlock. The public key is formatted as a RSA public key.
 */
@property (copy, nonatomic) void(^registerPublicKey)(NSData *pubKey, A0RegisterCompletionBlock completionBlock, A0ErrorBlock errorBlock);

/**
 *  Block to return the paylod for the JWT to be signed by the device. It will be called each time a JWT needs to be generated and signed. By default `A0TouchIDAuth` will include `iat`, `exp` (30 sec) and `sub` (Public Key fingerprint) claims but you can override them or add more entries to the payload.
 */
@property (copy, nonatomic) NSDictionary<NSString *, id> *(^jwtPayload)();

/**
 *  Block called with the signed JWT to authenticate against an API ednpoint.
 */
@property (copy, nonatomic) void(^authenticate)(NSString *jwt, A0ErrorBlock errorBlock);

/**
 *  Block called when an error occurred during the Authentication flow.
 */
@property (copy, nonatomic) void(^onError)(NSError *error);

/**
 * Localized message displayed in TouchID prompt.
 */
@property (copy, nullable, nonatomic) NSString *localizedTouchIDMessage;

/**
 *  Starts the TouchID authentication flow. It will fail automatically if `isTouchIDAuthenticationAvailable` returns `NO`.
 */
- (void)start;

/**
 *  Checks whether TouchID is available.
 *
 *  @return if TouchID is available or not.
 */
- (BOOL)isTouchIDAuthenticationAvailable;

/**
 *  Reset TouchID authentication info stored in the device.
 */
- (void)reset;

@end

NS_ASSUME_NONNULL_END