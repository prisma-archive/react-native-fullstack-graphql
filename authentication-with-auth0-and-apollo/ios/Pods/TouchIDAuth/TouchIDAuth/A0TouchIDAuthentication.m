// A0TouchIDAuthentication.m
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

#import "A0TouchIDAuthentication.h"
#import "NSData+A0JWTSafeBase64.h"
#import "A0RSAKeyExporter.h"
#import "A0JWTBuilder.h"
#import "A0TouchID.h"

#import <SimpleKeychain/A0SimpleKeychain+KeyPair.h>
#import <UIKit/UIKit.h>

#define kJWTTimeToLive 30

NSString * const A0TouchIDAuthenticationErrorKey = @"A0TouchIDAuthenticationErrorKey";

@interface A0TouchIDAuthentication ()
@property (strong, nonatomic) A0SimpleKeychain *keychain;
@property (strong, nonatomic) A0TouchID *touchID;
@property (strong, nonatomic) A0RSAKeyExporter *exporter;
@end

@implementation A0TouchIDAuthentication

- (instancetype)init {
    if (self) {
        _keychain = [A0SimpleKeychain keychainWithService:@"TouchIDAuthentication"];
        _touchID = [[A0TouchID alloc] init];
        _exporter = [[A0RSAKeyExporter alloc] init];
    }
    return self;
}

- (void)start {
    NSAssert(self.registerPublicKey != nil && self.authenticate, @"register pubkey and authenticate blocks must be non-nil");
    if ([self isTouchIDAuthenticationAvailable]) {
        [self performTouchIDChallenge];
    } else {
        [self safeFailWithError:[A0TouchIDAuthentication touchIDNotAvailableError]];
    }
}

- (BOOL)isTouchIDAuthenticationAvailable {
    return self.touchID.isAvailable;
}

- (void)reset {
    [self.keychain deleteRSAKeyWithTag:[self publicKeyTag]];
    [self.keychain deleteRSAKeyWithTag:[self privateKeyTag]];
}

#pragma mark - TouchID step

- (void)performTouchIDChallenge {
    __weak A0TouchIDAuthentication *weakSelf = self;
    [self.touchID validateWithCompletion:^(BOOL success, NSError *error) {
        if (success) {
            [weakSelf checkKeyPair];
        } else {
            [weakSelf safeFailWithError:[A0TouchIDAuthentication touchIDFailedWithError:error]];
        }
    } localizedReason:self.localizedTouchIDMessage];
}

#pragma mark - Key Pair generation step

- (void)checkKeyPair {
    __weak A0TouchIDAuthentication *weakSelf = self;
    A0RegisterCompletionBlock completionBlock = ^{
        [weakSelf generateJWT];
    };
    A0ErrorBlock errorBlock = ^(NSError *error) {
        [weakSelf safeFailWithError:error];
    };

    NSString *publicTag = [self publicKeyTag];
    NSString *privateTag = [self privateKeyTag];

    if ([self.keychain hasRSAKeyWithTag:publicTag]) {
        completionBlock();
    } else {
        [self.keychain generateRSAKeyPairWithLength:A0SimpleKeychainRSAKeySize1024Bits
                                       publicKeyTag:publicTag
                                      privateKeyTag:privateTag];
        NSData *publicKeyData = [self.exporter exportPublicKey:[self.keychain dataForRSAKeyWithTag:publicTag]];
        if (self.registerPublicKey) {
            self.registerPublicKey(publicKeyData, completionBlock, errorBlock);
        }
    }
}

- (NSString *)publicKeyTag {
    return [[[NSBundle mainBundle] bundleIdentifier] stringByAppendingString:@".pubkey"];
}

- (NSString *)privateKeyTag {
    return [[[NSBundle mainBundle] bundleIdentifier] stringByAppendingString:@".key"];
}

#pragma mark - JWT step

- (void)generateJWT {
    __weak A0TouchIDAuthentication *weakSelf = self;
    A0ErrorBlock errorBlock = ^(NSError *error) {
        [weakSelf safeFailWithError:error];
    };

    NSString *publicTag = [self publicKeyTag];
    long expiration = [[NSDate dateWithTimeIntervalSinceNow:kJWTTimeToLive] timeIntervalSince1970];
    long issuedAt = [[NSDate date] timeIntervalSince1970];
    NSMutableDictionary *claims = [@{
                                     @"sub": [self.exporter fingerprintOfKey:[self.keychain dataForRSAKeyWithTag:publicTag]],
                                     @"device": [[UIDevice currentDevice] name],
                                     @"exp": @(expiration),
                                     @"iat": @(issuedAt),
                                    } mutableCopy];
    if (self.jwtPayload) {
        [claims addEntriesFromDictionary:self.jwtPayload()];
    }

    A0JWTBuilder *builder = [[A0JWTBuilder alloc] init];
    SecKeyRef keyRef = [self.keychain keyRefOfRSAKeyWithTag:[self privateKeyTag]];
    NSString *jwt = [[[builder setJWTPayload:claims] signWithMethod:A0JWTSignMethodRS256 andKeyOrSecret:(__bridge id)(keyRef)] jwt];

    if (self.authenticate) {
        self.authenticate(jwt, errorBlock);
    }
}

#pragma mark - Error methods

+ (NSError *)touchIDNotAvailableError {
    NSError *error = [[NSError alloc] initWithDomain:@"com.auth0.TouchIDAuthentication"
                                                code:A0TouchIDAuthenticationErrorTouchIDNotAvailable
                                            userInfo:@{
                                                       NSLocalizedDescriptionKey: NSLocalizedString(@"TouchID is not configured or supported in the device", @"TouchID not available"),
                                                       }];
    return error;
}

+ (NSError *)touchIDFailedWithError:(NSError *)failError {
    NSMutableDictionary *userInfo = [@{
                                      NSLocalizedDescriptionKey: NSLocalizedString(@"Failed to authenticate using TouchID", @"User  failed to authenticate"),
                                      NSLocalizedFailureReasonErrorKey: NSLocalizedString(@"TouchID verification failed. Please try again.", @"TouchID verification failed"),
                                      } mutableCopy];
    if (failError) {
        userInfo[A0TouchIDAuthenticationErrorKey] = failError;

    }
    NSError *error = [[NSError alloc] initWithDomain:@"com.auth0.TouchIDAuthentication"
                                                code:A0TouchIDAuthenticationErrorTouchIDFailed
                                            userInfo:userInfo];
    return error;
}

- (void)safeFailWithError:(NSError *)error {
    if (self.onError) {
        self.onError(error);
    }
}
@end
