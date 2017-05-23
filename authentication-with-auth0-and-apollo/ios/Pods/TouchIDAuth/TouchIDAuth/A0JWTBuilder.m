// A0JWTBuilder.m
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

#import "A0JWTBuilder.h"
#import "NSData+A0JWTSafeBase64.h"
#import <CommonCrypto/CommonDigest.h>

#define kHashLength CC_SHA256_DIGEST_LENGTH

@interface A0JWTBuilder ()
@property (strong, nonatomic) NSString *header;
@property (strong, nonatomic) NSString *payload;
@property (strong, nonatomic) NSString *signature;
@end

@implementation A0JWTBuilder

- (instancetype)setJWTPayload:(NSDictionary *)payload {
    self.payload = [[NSJSONSerialization dataWithJSONObject:payload options:0 error:nil] a0_jwtSafeBase64String];
    return self;
}

- (instancetype)signWithMethod:(A0JWTSignMethod)signMethod andKeyOrSecret:(id)keyOrSecret {
    NSDictionary *header = @{
                             @"alg": @"RS256",
                             @"typ": @"JWT",
                             };
    self.header = [[NSJSONSerialization dataWithJSONObject:header options:0 error:nil] a0_jwtSafeBase64String];
    NSString *unsingedJWT = [[self.header stringByAppendingString:@"."] stringByAppendingString:self.payload];
    SecKeyRef privateKeyRef = (__bridge SecKeyRef)(keyOrSecret);
    NSData *signature;
    if (privateKeyRef) {
        size_t signatureSize = SecKeyGetBlockSize(privateKeyRef);
        uint8_t *signatureBytes = malloc(signatureSize * sizeof(uint8_t));
        memset(signatureBytes, 0x0, signatureSize);
        NSData *hashedJWT = [self SHA256OfValue:unsingedJWT];
        OSStatus status = SecKeyRawSign(privateKeyRef, kSecPaddingPKCS1SHA256, [hashedJWT bytes], kHashLength, signatureBytes, &signatureSize);
        if (status == errSecSuccess) {
            signature = [NSData dataWithBytes:signatureBytes length:signatureSize];
        }
        CFRelease(privateKeyRef);
        if (signatureBytes) {
            free(signatureBytes);
        }
    }
    self.signature = [signature a0_jwtSafeBase64String];
    return self;
}

- (NSString *)jwt {
    return [@[self.header, self.payload, self.signature] componentsJoinedByString:@"."];
}

- (NSData *)SHA256OfValue:(NSString *)value {
    CC_SHA256_CTX ctx;

    uint8_t * hashBytes = malloc(CC_SHA256_DIGEST_LENGTH * sizeof(uint8_t));
    memset(hashBytes, 0x0, CC_SHA256_DIGEST_LENGTH);

    NSData *valueData = [value dataUsingEncoding:NSUTF8StringEncoding];

    CC_SHA256_Init(&ctx);
    CC_SHA256_Update(&ctx, [valueData bytes], (CC_LONG)[valueData length]);
    CC_SHA256_Final(hashBytes, &ctx);

    NSData *hash = [NSData dataWithBytes:hashBytes length:CC_SHA256_DIGEST_LENGTH];

    if (hashBytes) {
        free(hashBytes);
    }
    
    return hash;
}

@end
