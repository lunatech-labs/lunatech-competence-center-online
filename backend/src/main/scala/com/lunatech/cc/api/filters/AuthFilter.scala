package com.lunatech.cc.api.filters

import com.twitter.finagle.{Service, SimpleFilter}
import com.twitter.finagle.http.{Request, Response}
import com.twitter.io.Buf
import com.twitter.util.Future

object AuthFilter extends SimpleFilter[Request, Response] {

  override def apply(request: Request, service: Service[Request, Response]): Future[Response] = {
    if(request.headerMap.contains("X-ID-Token")){
      service(request)
    } else {
      Future.value{
        val rep = Response()
        rep.content = Buf.Utf8("Required header 'X-ID-Token' not present in the request.")
        rep.contentType = "text/plain"
        rep.statusCode(401)
        rep
      }
    }
  }

}
