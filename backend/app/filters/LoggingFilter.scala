package filters

import akka.stream.Materializer
import javax.inject._
import play.api.Logging
import play.api.mvc._
import scala.concurrent.{ExecutionContext, Future}


@Singleton
class LoggingFilter @Inject()(implicit val mat: Materializer, ec: ExecutionContext) extends Filter with Logging {

  def apply(nextFilter: RequestHeader => Future[Result])(requestHeader: RequestHeader): Future[Result] = {
    val startTime = System.currentTimeMillis
    nextFilter(requestHeader).map { result =>
      val endTime     = System.currentTimeMillis
      val requestTime = endTime - startTime
      logger.info(
        s"${requestHeader.method} ${requestHeader.uri} took ${requestTime}ms and returned ${result.header.status}"
      )
      result.withHeaders("X-Request-Time" -> requestTime.toString)
    }
  }
}