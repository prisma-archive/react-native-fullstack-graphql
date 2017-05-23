// A0TouchIDAvailability.m
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

#import "A0TouchID.h"

#import <SimpleKeychain/A0SimpleKeychain.h>
#ifdef __IPHONE_8_0
#import <LocalAuthentication/LocalAuthentication.h>
#endif

#define kTouchIDEntryKey @"auth0-touchid-flag"

@implementation A0TouchID

- (BOOL)isAvailable {
#if TARGET_IPHONE_SIMULATOR
    return YES;
#elif defined __IPHONE_8_0
    if (floor(NSFoundationVersionNumber) > NSFoundationVersionNumber_iOS_7_1) { //iOS 8
        LAContext *context = [[LAContext alloc] init];
        NSError *error;
        BOOL available = [context canEvaluatePolicy: LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error];
        if (!available || error) {
            NSLog(@"TouchID is not available for device. Error: %@", error);
        }
        return available;
    } else { //iOS <= 7.1
        NSLog(@"You need iOS 8 to use TouchID local authentication");
        return NO;
    }
#else
    NSLog(@"You need iOS 8 to use TouchID local authentication");
    return NO;
#endif
}

- (void)validateWithCompletion:(void (^)(BOOL, NSError *))completionBlock
               localizedReason:(NSString *)localizedReason {
#if TARGET_IPHONE_SIMULATOR
    if (completionBlock) {
        completionBlock(YES, nil);
    }
#else
    A0SimpleKeychain *keychain = [A0SimpleKeychain keychainWithService:@"TouchID"];
    keychain.useAccessControl = YES;
    keychain.defaultAccessiblity = A0SimpleKeychainItemAccessibleWhenUnlockedThisDeviceOnly;
    NSString *message = localizedReason ?: NSLocalizedString(@"Please authenticate to continue...", @"Default reason");
    [keychain deleteEntryForKey:kTouchIDEntryKey];
    [keychain setString:[[NSBundle mainBundle] bundleIdentifier] forKey:kTouchIDEntryKey promptMessage:message];
    BOOL success = [keychain stringForKey:kTouchIDEntryKey promptMessage:message] != nil;
    if (completionBlock) {
        completionBlock(success, nil);
    }
#endif
}

- (void)validateWithCompletion:(void (^)(BOOL, NSError *))completionBlock {
    [self validateWithCompletion:completionBlock
                 localizedReason:nil];
}
@end
