import * as joi from "joi";

export const envSchema = joi.object().keys({
  NODE_ENV: joi.string().valid("production", "development").required(),
  DATABASE_URL: joi.string().required(),
  JWT_SECRET: joi.string().required(),
  HTTP_PORT: joi.number().required(),
  HOST: joi.string().required(),
  REDIS_HOST: joi.string().hostname(),
  REDIS_PORT: joi.number().required(),
  REDIS_USERNAME: joi.string().allow(null, "").optional(),
  REDIS_PASSWORD: joi.string().allow(null, "").optional(),
  STORAGE_TYPE: joi.string().valid("local", "s3"),
  STORAGE_LOCAL_DIR: joi.alternatives().conditional("STORAGE_TYPE", { is: "local", then: joi.string().required(), otherwise: joi.string().optional() }),
  S3_STORAGE_ENDPOINT: joi.alternatives().conditional("STORAGE_TYPE", { is: "s3", then: joi.string().required(), otherwise: joi.string().allow(null, "").optional() }),
  S3_STORAGE_ACCESS_KEY: joi.alternatives().conditional("STORAGE_TYPE", { is: "s3", then: joi.string().required(), otherwise: joi.string().allow(null, "").optional() }),
  S3_STORAGE_SECRET_KEY: joi.alternatives().conditional("STORAGE_TYPE", { is: "s3", then: joi.string().required(), otherwise: joi.string().allow(null, "").optional() }),
  S3_STORAGE_REGION: joi.alternatives().conditional("STORAGE_TYPE", { is: "s3", then: joi.string().required(), otherwise: joi.string().allow(null, "").optional() }),
  S3_STORAGE_BUCKET: joi.alternatives().conditional("STORAGE_TYPE", { is: "s3", then: joi.string().required(), otherwise: joi.string().allow(null, "").optional() }),
  SMTP_HOST: joi.string().allow(null, "").optional(),
  SMTP_PORT: joi.string().allow(null, "").optional(),
  SMTP_USERNAME: joi.string().allow(null, "").optional(),
  SMTP_PASSWORD: joi.string().allow(null, "").optional(),
  SSL_KEY_BASE64: joi.string().allow(null, "").optional(),
  SSL_CERT_BASE64: joi.string().allow(null, "").optional(),
  SCHOLARSOME_RECAPTCHA_SITE: joi.string().allow(null, "").optional(),
  SCHOLARSOME_RECAPTCHA_SECRET: joi.string().allow(null, "").optional(),
  SCHOLARSOME_HEAD_SCRIPTS_BASE64: joi.string().allow(null, "").optional()
}).unknown();
