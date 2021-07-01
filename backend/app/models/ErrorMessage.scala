package models

import play.api.libs.json.{Json, OWrites}

case class ErrorBody(errors: List[ErrorMessage])

case class ErrorMessage(code: String, message: String, developerMessage: String = "")

object ErrorBody {
  implicit val errorBodyWrites: OWrites[ErrorBody] = Json.writes[ErrorBody]
}

object ErrorMessage {
  implicit val errorMessageWrites: OWrites[ErrorMessage] = Json.writes[ErrorMessage]

  val CODE_JWT_BEARER_MISSING = "jwt/bearer-missing"
  val CODE_JWT_ISSUER_MISSING = "jwt/issuer-missing"
  val CODE_JWT_INVALID_SIGNATURE = "jwt/invalid-signature"
  val CODE_JWT_INVALID_ISSUER = "jwt/invalid-issuer"
  val CODE_LDAP_CONNECTION_CONFIG = "ldap/connection-config"
  val CODE_LDAP_ENTRY_MISSING = "ldap/entry-missing"
  val CODE_LDAP_CURSOR_FAILED = "ldap/cursor-failed"
  val CODE_LDAP_AUTHENTICATION_FAILED = "ldap/authentication-failed"
  val CODE_LDAP_CLOSING_FAILED = "ldap/closing-failed"
  val CODE_INSTANCE_LIST_FAILED = "database/list-failed"
  val CODE_INSTANCE_CREATE_FAILED = "database/create-failed"
  val CODE_INSTANCE_CREATE_DUPLICATED = "database/create-duplicated"
  val CODE_INSTANCE_EXISTS_FAILED = "database/exists-failed"

  val MESSAGE_LDAP_ENTRY_MISSING = "Your account could not loaded. Please contact the support."
  val MESSAGE_LDAP_AUTHENTICATION_FAILED = "An account with this profile was not found."
  val MESSAGE_LDAP_CONNECTION_CONFIG = "The authentication service cannot load its internal configuration."
  val MESSAGE_JWT_ISSUER_MISSING = "Issuer in JWT required."
  val MESSAGE_JWT_INVALID_SIGNATURE = "JWT has a invalid signature."
  val MESSAGE_INSTANCE_LIST_FAILED = "Could not retrieve the instance list."
  val MESSAGE_INSTANCE_CREATE_FAILED = "Could not create a database."
  val MESSAGE_INSTANCE_CREATE_DUPLICATED = "Database name is already reserved."
  val MESSAGE_INSTANCE_EXISTS_FAILED = "Could not check for this database."
}

