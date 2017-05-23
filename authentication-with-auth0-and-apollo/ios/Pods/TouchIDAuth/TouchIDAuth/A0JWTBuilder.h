// A0JWTBuilder.h
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

/**
 *  Types of Sign for a JWT
 */
typedef NS_ENUM(NSUInteger, A0JWTSignMethod){
    /**
     *  RS256 (RSA with SHA256).
     */
    A0JWTSignMethodRS256 = 0,
};

/**
 *  Builder of JWT.
 */
@interface A0JWTBuilder : NSObject

/**
 *  Sets the JWT payload
 *
 *  @param payload new payload
 *
 *  @return the instance itself.
 */
- (instancetype)setJWTPayload:(NSDictionary *)payload;

/**
 *  Signs the current payload and generates the header accordingly. For the moment only RS256 is supported.
 *
 *  @param signMethod  sign method used.
 *  @param keyOrSecret key or secret
 *
 *  @return then instance itself.
 */
- (instancetype)signWithMethod:(A0JWTSignMethod)signMethod andKeyOrSecret:(id)keyOrSecret;

/**
 *  Returns the JWT. If it's not signed it will return nil.
 *
 *  @return the JWT or nil.
 */
- (NSString *)jwt;

@end
