// A0RSAKeyExporter.m
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

#import "A0RSAKeyExporter.h"

#import <CommonCrypto/CommonDigest.h>

@implementation A0RSAKeyExporter

- (NSData *)exportPublicKey:(NSData *)keyData {
    if (keyData) {
        NSMutableString *rsaKey = [[NSMutableString alloc] init];
        [rsaKey appendString:@"-----BEGIN RSA PUBLIC KEY-----"];
        [rsaKey appendString:@"\n"];
        [rsaKey appendString:[keyData base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength|NSDataBase64EncodingEndLineWithCarriageReturn]];
        [rsaKey appendString:@"\n"];
        [rsaKey appendString:@"-----END RSA PUBLIC KEY-----"];
        return [rsaKey dataUsingEncoding:NSUTF8StringEncoding];
    } else {
        return nil;
    }
}

- (NSString *)fingerprintOfKey:(NSData *)keyData {
    unsigned char result[16];
    CC_MD5(keyData.bytes, (CC_LONG)keyData.length, result);

    return [NSString stringWithFormat:
            @"%02X:%02X:%02X:%02X:%02X:%02X:%02X:%02X:%02X:%02X:%02X:%02X:%02X:%02X:%02X:%02X",
            result[0], result[1], result[2], result[3],
            result[4], result[5], result[6], result[7],
            result[8], result[9], result[10], result[11],
            result[12], result[13], result[14], result[15]
            ];
}

@end
