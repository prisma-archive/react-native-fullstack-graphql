# TouchIDAuth

[![CI Status](http://img.shields.io/travis/auth0/TouchIDAuth.svg?style=flat)](https://travis-ci.org/auth0/TouchIDAuth)
[![Version](https://img.shields.io/cocoapods/v/TouchIDAuth.svg?style=flat)](http://cocoadocs.org/docsets/TouchIDAuth)
[![License](https://img.shields.io/cocoapods/l/TouchIDAuth.svg?style=flat)](http://cocoadocs.org/docsets/TouchIDAuth)
[![Platform](https://img.shields.io/cocoapods/p/TouchIDAuth.svg?style=flat)](http://cocoadocs.org/docsets/TouchIDAuth)
[![Carthage compatible](https://img.shields.io/badge/Carthage-compatible-4BC51D.svg?style=flat)](https://github.com/Carthage/Carthage)

TouchIDAuth provides a default implementation for a passwordless login flow using TouchID and JWT.

![TouchID Flow](/Flow.png "TouchID Flow")

The flow is represented in the following graph:

1. Validate the user presence using TouchID
1. Check if the user has a key pair
  1. Generate a key pair
  1. Register the Public Key for the user.
1. Generate a JWT and signs it with the Private Key using **RS256**
1. Authenticate the user with the signed JWT.

![TouchID demo](https://cloudup.com/cyDR07xBX3j+)

## Requirements

The library requires iOS 8+ and a device with TouchID.

## Installation

### CocoaPods

TouchIDAuth is available through [CocoaPods](http://cocoapods.org). To install
it, simply add the following line to your Podfile:

    pod "TouchIDAuth"

### Carthage

In your Cartfile add the following

```
github "auth0/TouchIDAuth"
```
 

## Running Example app

To run the example project, clone the repo, and run `pod install` from the Example directory first.
And then in [A0ViewController](https://github.com/auth0/TouchIDAuth/blob/master/MyTouchID/ViewController.m#L32) add your IP address or hostname for the mock server URL:

```objc
#define kBaseURL @"http://mymac.local:3000"
```

To run the mock server, go to the folder [TouchIDAuthServer](https://github.com/auth0/TouchIDAuth/tree/master/TouchIDAuthServer) and run the following commands:
```bash
npm install
node app.js
```

## Usage

First you'll need to instantiate it
```objc
A0TouchIDAuthentication *authentication = [[A0TouchIDAuthentication alloc] init];
```
Then you need to configure a couple of callbacks that will be called during the authentication flow. There are three callbacks, `registerPublicKey`, `jwtPayload` and `authenticate`.

The callback `registerPublicKey` will handle the registration of the public key against an API and must call `completionBlock` on success in order to continue with the flow (or `errorBlock` if it fails). For example:

```objc
authentication.registerPublicKey = ^(NSData *pubKey, A0RegisterCompletionBlock completionBlock, A0ErrorBlock errorBlock) {
      AFHTTPRequestOperationManager *manager = [[AFHTTPRequestOperationManager alloc] initWithBaseURL:baseURL];
      //Configure AFHTTPRequestOperationManager
      [manager POST:@"/pubkey" parameters:params success:^(AFHTTPRequestOperation *operation, id responseObject) {
          completionBlock();
      } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
          errorBlock(error);
      }];
  };
};
```

 The callback `jwtPayload` is called before generating the JWT in order to provide the JWT payload needed by your API endpoint. For example:

```objc
authentication.jwtPayload = ^{
    return @{
      @"iss": @"Issuer",
      @"custom_key": @"value",
    };
};
```
 The callback `authenticate` will receive the signed JWT and will need to authenticate against your API endpoint. For example:

```objc
authentication.authenticate = ^(NSString *jwt, A0ErrorBlock errorBlock) {
  NSDictionary *params = @{
                           @"jwt": jwt,
                           };
  AFHTTPRequestOperationManager *manager = [[AFHTTPRequestOperationManager alloc] initWithBaseURL:baseURL];
  //Configure AFHTTPRequestOperationManager
  [manager POST:@"/login" parameters:params success:^(AFHTTPRequestOperation *operation, id responseObject) {
    NSLog(@"Logged in!!!");
  } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
    errorBlock(error);
  }];
};
```

There is an extra callback `onError` that will be called whenever an error ocurrs while executing the Auth flow:
```objc
authentication.onError = ^(NSError *error) {
  NSLog(@"ERROR %@", error);
};
```

At last, call the following method to start the authentication flow:
```objc
[authentication start];
```
> Before calling `start`, it's recommended to check if **TouchID** is enabled in the device calling the method [isTouchIDAuthenticationAvailable](#a0touchidauthenticationistouchidauthenticationavailable).

##API

###A0TouchIDAuthentication

####A0TouchIDAuthentication#registerPublicKey
```objc
@property (copy, nonatomic) void(^registerPublicKey)(NSData *pubKey, A0RegisterCompletionBlock completionBlock, A0ErrorBlock errorBlock);
```
Block to handle public key registration with an API Endpoint. It will receive 3 parameters: publicKey, completionBlock and errorBlock. The public key is formatted as a RSA public key.

####A0TouchIDAuthentication#jwtPayload
```objc
@property (copy, nonatomic) NSDictionary *(^jwtPayload)();
```
Block to return the paylod for the JWT to be signed by the device. It will be called each time a JWT needs to be generated and signed. By default `A0TouchIDAuth` will include `iat`, `exp` (30 sec) and `sub` (Public Key fingerprint) claims but you can override them or add more entries to the payload.

####A0TouchIDAuthentication#authenticate
```objc
@property (copy, nonatomic) void(^authenticate)(NSString *jwt, A0ErrorBlock errorBlock);
```
Block called with the signed JWT to authenticate against an API ednpoint.

####A0TouchIDAuthentication#onError
```objc
@property (copy, nonatomic) void(^onError)(NSError *error);
```
Block called when an error occurred during the Authentication flow.

####A0TouchIDAuthentication#localizedTouchIDMessage
```objc
@property (copy, nonatomic) NSString *localizedTouchIDMessage;
```
Localized message displayed in TouchID prompt.

####A0TouchIDAuthentication#start
```objc
- (void)start;
```
Starts the TouchID authentication flow. It will fail automatically if `isTouchIDAuthenticationAvailable` returns `NO`.

####A0TouchIDAuthentication#isTouchIDAuthenticationAvailable
```objc
- (BOOL)isTouchIDAuthenticationAvailable;
```
Check if TouchID is supported by the device and configured.

####A0TouchIDAuthentication#reset
```objc
- (void)reset;
```
Reset TouchID authentication info stored in the device.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, amont others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free account in Auth0

1. Go to [Auth0](https://auth0.com) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## License

TouchIDAuth is available under the MIT license. See the [LICENSE file](https://github.com/auth0/TouchIDAuth/blob/master/LICENSE) for more info.
