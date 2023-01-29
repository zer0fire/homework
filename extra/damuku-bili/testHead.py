# -*- coding: utf-8 -*-
import requests
import time
import hashlib
import hmac
import random
from hashlib import sha256
 
def testPostRequest():
    # postUrl = "https://xxx.xxx.com/api"
    params = '{"room_id":22543273}'
    key = "申请的access_key"
    secret = "申请的access_secret"
 
    md5 = hashlib.md5()
    md5.update(params.encode())
    ts = time.time()
    nonce = random.randint(1,100000)+time.time()
    md5data = md5.hexdigest()
    headerMap = {
        "x-bili-timestamp": str(int(ts)),
        "x-bili-signature-method": "HMAC-SHA256",
        "x-bili-signature-nonce": str(nonce),
        "x-bili-accesskeyid": key,
        "x-bili-signature-version": "1.0",
        "x-bili-content-md5": md5data,
    }
 
    headerList = sorted(headerMap)
    headerStr = ''
 
    for key in headerList:
        headerStr = headerStr+ key+":"+str(headerMap[key])+"\n"
    headerStr = headerStr.rstrip("\n")
 
    appsecret = secret.encode()
    data = headerStr.encode()
    signature = hmac.new(appsecret, data, digestmod=sha256).hexdigest()
    headerMap["Authorization"] = signature
    headerMap["Content-Type"] = "application/json"
    headerMap["Accept"] = "application/json"
 
    # r = requests.post(url=postUrl, headers=headerMap, data=params, verify=False)
    # print (r.content.decode())
    # print (r.status_code)
    print(headerStr)
    print(ts)
    print(nonce)
    print(md5data)
if __name__=='__main__':
    testPostRequest()