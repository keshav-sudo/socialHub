
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Conversation
 * 
 */
export type Conversation = $Result.DefaultSelection<Prisma.$ConversationPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>
/**
 * Model MessageReadStatus
 * 
 */
export type MessageReadStatus = $Result.DefaultSelection<Prisma.$MessageReadStatusPayload>
/**
 * Model UnreadCount
 * 
 */
export type UnreadCount = $Result.DefaultSelection<Prisma.$UnreadCountPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ChatType: {
  SINGLE: 'SINGLE',
  GROUP: 'GROUP'
};

export type ChatType = (typeof ChatType)[keyof typeof ChatType]


export const MsgStatus: {
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  READ: 'READ',
  FAILED: 'FAILED'
};

export type MsgStatus = (typeof MsgStatus)[keyof typeof MsgStatus]


export const MessageType: {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  FILE: 'FILE'
};

export type MessageType = (typeof MessageType)[keyof typeof MessageType]

}

export type ChatType = $Enums.ChatType

export const ChatType: typeof $Enums.ChatType

export type MsgStatus = $Enums.MsgStatus

export const MsgStatus: typeof $Enums.MsgStatus

export type MessageType = $Enums.MessageType

export const MessageType: typeof $Enums.MessageType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Conversations
 * const conversations = await prisma.conversation.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Conversations
   * const conversations = await prisma.conversation.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P]): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number }): $Utils.JsPromise<R>

  /**
   * Executes a raw MongoDB command and returns the result of it.
   * @example
   * ```
   * const user = await prisma.$runCommandRaw({
   *   aggregate: 'User',
   *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
   *   explain: false,
   * })
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $runCommandRaw(command: Prisma.InputJsonObject): Prisma.PrismaPromise<Prisma.JsonObject>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.conversation`: Exposes CRUD operations for the **Conversation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Conversations
    * const conversations = await prisma.conversation.findMany()
    * ```
    */
  get conversation(): Prisma.ConversationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.messageReadStatus`: Exposes CRUD operations for the **MessageReadStatus** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MessageReadStatuses
    * const messageReadStatuses = await prisma.messageReadStatus.findMany()
    * ```
    */
  get messageReadStatus(): Prisma.MessageReadStatusDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.unreadCount`: Exposes CRUD operations for the **UnreadCount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UnreadCounts
    * const unreadCounts = await prisma.unreadCount.findMany()
    * ```
    */
  get unreadCount(): Prisma.UnreadCountDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.17.1
   * Query Engine version: 272a37d34178c2894197e17273bf937f25acdeac
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Conversation: 'Conversation',
    Message: 'Message',
    MessageReadStatus: 'MessageReadStatus',
    UnreadCount: 'UnreadCount'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "conversation" | "message" | "messageReadStatus" | "unreadCount"
      txIsolationLevel: never
    }
    model: {
      Conversation: {
        payload: Prisma.$ConversationPayload<ExtArgs>
        fields: Prisma.ConversationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConversationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConversationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          findFirst: {
            args: Prisma.ConversationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConversationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          findMany: {
            args: Prisma.ConversationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>[]
          }
          create: {
            args: Prisma.ConversationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          createMany: {
            args: Prisma.ConversationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ConversationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          update: {
            args: Prisma.ConversationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          deleteMany: {
            args: Prisma.ConversationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConversationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ConversationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          aggregate: {
            args: Prisma.ConversationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConversation>
          }
          groupBy: {
            args: Prisma.ConversationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConversationGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.ConversationFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.ConversationAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.ConversationCountArgs<ExtArgs>
            result: $Utils.Optional<ConversationCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.MessageFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.MessageAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
      MessageReadStatus: {
        payload: Prisma.$MessageReadStatusPayload<ExtArgs>
        fields: Prisma.MessageReadStatusFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageReadStatusFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageReadStatusFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload>
          }
          findFirst: {
            args: Prisma.MessageReadStatusFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageReadStatusFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload>
          }
          findMany: {
            args: Prisma.MessageReadStatusFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload>[]
          }
          create: {
            args: Prisma.MessageReadStatusCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload>
          }
          createMany: {
            args: Prisma.MessageReadStatusCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MessageReadStatusDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload>
          }
          update: {
            args: Prisma.MessageReadStatusUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload>
          }
          deleteMany: {
            args: Prisma.MessageReadStatusDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageReadStatusUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MessageReadStatusUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessageReadStatusPayload>
          }
          aggregate: {
            args: Prisma.MessageReadStatusAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessageReadStatus>
          }
          groupBy: {
            args: Prisma.MessageReadStatusGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageReadStatusGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.MessageReadStatusFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.MessageReadStatusAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.MessageReadStatusCountArgs<ExtArgs>
            result: $Utils.Optional<MessageReadStatusCountAggregateOutputType> | number
          }
        }
      }
      UnreadCount: {
        payload: Prisma.$UnreadCountPayload<ExtArgs>
        fields: Prisma.UnreadCountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UnreadCountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnreadCountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UnreadCountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnreadCountPayload>
          }
          findFirst: {
            args: Prisma.UnreadCountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnreadCountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UnreadCountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnreadCountPayload>
          }
          findMany: {
            args: Prisma.UnreadCountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnreadCountPayload>[]
          }
          create: {
            args: Prisma.UnreadCountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnreadCountPayload>
          }
          createMany: {
            args: Prisma.UnreadCountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UnreadCountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnreadCountPayload>
          }
          update: {
            args: Prisma.UnreadCountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnreadCountPayload>
          }
          deleteMany: {
            args: Prisma.UnreadCountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UnreadCountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UnreadCountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnreadCountPayload>
          }
          aggregate: {
            args: Prisma.UnreadCountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUnreadCount>
          }
          groupBy: {
            args: Prisma.UnreadCountGroupByArgs<ExtArgs>
            result: $Utils.Optional<UnreadCountGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.UnreadCountFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.UnreadCountAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.UnreadCountCountArgs<ExtArgs>
            result: $Utils.Optional<UnreadCountCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $runCommandRaw: {
          args: Prisma.InputJsonObject,
          result: Prisma.JsonObject
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    conversation?: ConversationOmit
    message?: MessageOmit
    messageReadStatus?: MessageReadStatusOmit
    unreadCount?: UnreadCountOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model Conversation
   */

  export type AggregateConversation = {
    _count: ConversationCountAggregateOutputType | null
    _min: ConversationMinAggregateOutputType | null
    _max: ConversationMaxAggregateOutputType | null
  }

  export type ConversationMinAggregateOutputType = {
    id: string | null
    conversationId: string | null
    chatType: $Enums.ChatType | null
    lastMessage: string | null
    lastMessageBy: string | null
    lastMessageAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConversationMaxAggregateOutputType = {
    id: string | null
    conversationId: string | null
    chatType: $Enums.ChatType | null
    lastMessage: string | null
    lastMessageBy: string | null
    lastMessageAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConversationCountAggregateOutputType = {
    id: number
    conversationId: number
    chatType: number
    participants: number
    lastMessage: number
    lastMessageBy: number
    lastMessageAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ConversationMinAggregateInputType = {
    id?: true
    conversationId?: true
    chatType?: true
    lastMessage?: true
    lastMessageBy?: true
    lastMessageAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConversationMaxAggregateInputType = {
    id?: true
    conversationId?: true
    chatType?: true
    lastMessage?: true
    lastMessageBy?: true
    lastMessageAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConversationCountAggregateInputType = {
    id?: true
    conversationId?: true
    chatType?: true
    participants?: true
    lastMessage?: true
    lastMessageBy?: true
    lastMessageAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ConversationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conversation to aggregate.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Conversations
    **/
    _count?: true | ConversationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConversationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConversationMaxAggregateInputType
  }

  export type GetConversationAggregateType<T extends ConversationAggregateArgs> = {
        [P in keyof T & keyof AggregateConversation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConversation[P]>
      : GetScalarType<T[P], AggregateConversation[P]>
  }




  export type ConversationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationWhereInput
    orderBy?: ConversationOrderByWithAggregationInput | ConversationOrderByWithAggregationInput[]
    by: ConversationScalarFieldEnum[] | ConversationScalarFieldEnum
    having?: ConversationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConversationCountAggregateInputType | true
    _min?: ConversationMinAggregateInputType
    _max?: ConversationMaxAggregateInputType
  }

  export type ConversationGroupByOutputType = {
    id: string
    conversationId: string
    chatType: $Enums.ChatType
    participants: string[]
    lastMessage: string | null
    lastMessageBy: string | null
    lastMessageAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ConversationCountAggregateOutputType | null
    _min: ConversationMinAggregateOutputType | null
    _max: ConversationMaxAggregateOutputType | null
  }

  type GetConversationGroupByPayload<T extends ConversationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConversationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConversationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConversationGroupByOutputType[P]>
            : GetScalarType<T[P], ConversationGroupByOutputType[P]>
        }
      >
    >


  export type ConversationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    chatType?: boolean
    participants?: boolean
    lastMessage?: boolean
    lastMessageBy?: boolean
    lastMessageAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["conversation"]>



  export type ConversationSelectScalar = {
    id?: boolean
    conversationId?: boolean
    chatType?: boolean
    participants?: boolean
    lastMessage?: boolean
    lastMessageBy?: boolean
    lastMessageAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ConversationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "conversationId" | "chatType" | "participants" | "lastMessage" | "lastMessageBy" | "lastMessageAt" | "createdAt" | "updatedAt", ExtArgs["result"]["conversation"]>

  export type $ConversationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Conversation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      conversationId: string
      chatType: $Enums.ChatType
      participants: string[]
      lastMessage: string | null
      lastMessageBy: string | null
      lastMessageAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["conversation"]>
    composites: {}
  }

  type ConversationGetPayload<S extends boolean | null | undefined | ConversationDefaultArgs> = $Result.GetResult<Prisma.$ConversationPayload, S>

  type ConversationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConversationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConversationCountAggregateInputType | true
    }

  export interface ConversationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Conversation'], meta: { name: 'Conversation' } }
    /**
     * Find zero or one Conversation that matches the filter.
     * @param {ConversationFindUniqueArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConversationFindUniqueArgs>(args: SelectSubset<T, ConversationFindUniqueArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Conversation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConversationFindUniqueOrThrowArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConversationFindUniqueOrThrowArgs>(args: SelectSubset<T, ConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Conversation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindFirstArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConversationFindFirstArgs>(args?: SelectSubset<T, ConversationFindFirstArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Conversation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindFirstOrThrowArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConversationFindFirstOrThrowArgs>(args?: SelectSubset<T, ConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Conversations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Conversations
     * const conversations = await prisma.conversation.findMany()
     * 
     * // Get first 10 Conversations
     * const conversations = await prisma.conversation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conversationWithIdOnly = await prisma.conversation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConversationFindManyArgs>(args?: SelectSubset<T, ConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Conversation.
     * @param {ConversationCreateArgs} args - Arguments to create a Conversation.
     * @example
     * // Create one Conversation
     * const Conversation = await prisma.conversation.create({
     *   data: {
     *     // ... data to create a Conversation
     *   }
     * })
     * 
     */
    create<T extends ConversationCreateArgs>(args: SelectSubset<T, ConversationCreateArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Conversations.
     * @param {ConversationCreateManyArgs} args - Arguments to create many Conversations.
     * @example
     * // Create many Conversations
     * const conversation = await prisma.conversation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConversationCreateManyArgs>(args?: SelectSubset<T, ConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Conversation.
     * @param {ConversationDeleteArgs} args - Arguments to delete one Conversation.
     * @example
     * // Delete one Conversation
     * const Conversation = await prisma.conversation.delete({
     *   where: {
     *     // ... filter to delete one Conversation
     *   }
     * })
     * 
     */
    delete<T extends ConversationDeleteArgs>(args: SelectSubset<T, ConversationDeleteArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Conversation.
     * @param {ConversationUpdateArgs} args - Arguments to update one Conversation.
     * @example
     * // Update one Conversation
     * const conversation = await prisma.conversation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConversationUpdateArgs>(args: SelectSubset<T, ConversationUpdateArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Conversations.
     * @param {ConversationDeleteManyArgs} args - Arguments to filter Conversations to delete.
     * @example
     * // Delete a few Conversations
     * const { count } = await prisma.conversation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConversationDeleteManyArgs>(args?: SelectSubset<T, ConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Conversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Conversations
     * const conversation = await prisma.conversation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConversationUpdateManyArgs>(args: SelectSubset<T, ConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Conversation.
     * @param {ConversationUpsertArgs} args - Arguments to update or create a Conversation.
     * @example
     * // Update or create a Conversation
     * const conversation = await prisma.conversation.upsert({
     *   create: {
     *     // ... data to create a Conversation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Conversation we want to update
     *   }
     * })
     */
    upsert<T extends ConversationUpsertArgs>(args: SelectSubset<T, ConversationUpsertArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Conversations that matches the filter.
     * @param {ConversationFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const conversation = await prisma.conversation.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: ConversationFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Conversation.
     * @param {ConversationAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const conversation = await prisma.conversation.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: ConversationAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Conversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationCountArgs} args - Arguments to filter Conversations to count.
     * @example
     * // Count the number of Conversations
     * const count = await prisma.conversation.count({
     *   where: {
     *     // ... the filter for the Conversations we want to count
     *   }
     * })
    **/
    count<T extends ConversationCountArgs>(
      args?: Subset<T, ConversationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConversationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Conversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConversationAggregateArgs>(args: Subset<T, ConversationAggregateArgs>): Prisma.PrismaPromise<GetConversationAggregateType<T>>

    /**
     * Group by Conversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConversationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConversationGroupByArgs['orderBy'] }
        : { orderBy?: ConversationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Conversation model
   */
  readonly fields: ConversationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Conversation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConversationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Conversation model
   */
  interface ConversationFieldRefs {
    readonly id: FieldRef<"Conversation", 'String'>
    readonly conversationId: FieldRef<"Conversation", 'String'>
    readonly chatType: FieldRef<"Conversation", 'ChatType'>
    readonly participants: FieldRef<"Conversation", 'String[]'>
    readonly lastMessage: FieldRef<"Conversation", 'String'>
    readonly lastMessageBy: FieldRef<"Conversation", 'String'>
    readonly lastMessageAt: FieldRef<"Conversation", 'DateTime'>
    readonly createdAt: FieldRef<"Conversation", 'DateTime'>
    readonly updatedAt: FieldRef<"Conversation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Conversation findUnique
   */
  export type ConversationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation findUniqueOrThrow
   */
  export type ConversationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation findFirst
   */
  export type ConversationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conversations.
     */
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation findFirstOrThrow
   */
  export type ConversationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conversations.
     */
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation findMany
   */
  export type ConversationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Filter, which Conversations to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation create
   */
  export type ConversationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * The data needed to create a Conversation.
     */
    data: XOR<ConversationCreateInput, ConversationUncheckedCreateInput>
  }

  /**
   * Conversation createMany
   */
  export type ConversationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Conversations.
     */
    data: ConversationCreateManyInput | ConversationCreateManyInput[]
  }

  /**
   * Conversation update
   */
  export type ConversationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * The data needed to update a Conversation.
     */
    data: XOR<ConversationUpdateInput, ConversationUncheckedUpdateInput>
    /**
     * Choose, which Conversation to update.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation updateMany
   */
  export type ConversationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Conversations.
     */
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyInput>
    /**
     * Filter which Conversations to update
     */
    where?: ConversationWhereInput
    /**
     * Limit how many Conversations to update.
     */
    limit?: number
  }

  /**
   * Conversation upsert
   */
  export type ConversationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * The filter to search for the Conversation to update in case it exists.
     */
    where: ConversationWhereUniqueInput
    /**
     * In case the Conversation found by the `where` argument doesn't exist, create a new Conversation with this data.
     */
    create: XOR<ConversationCreateInput, ConversationUncheckedCreateInput>
    /**
     * In case the Conversation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConversationUpdateInput, ConversationUncheckedUpdateInput>
  }

  /**
   * Conversation delete
   */
  export type ConversationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Filter which Conversation to delete.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation deleteMany
   */
  export type ConversationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conversations to delete
     */
    where?: ConversationWhereInput
    /**
     * Limit how many Conversations to delete.
     */
    limit?: number
  }

  /**
   * Conversation findRaw
   */
  export type ConversationFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Conversation aggregateRaw
   */
  export type ConversationAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Conversation without action
   */
  export type ConversationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageMinAggregateOutputType = {
    id: string | null
    conversationId: string | null
    messageType: $Enums.MessageType | null
    senderId: string | null
    senderUsername: string | null
    content: string | null
    mediaUrl: string | null
    status: $Enums.MsgStatus | null
    isDeleted: boolean | null
    deletedAt: Date | null
    replyTo: string | null
    createdAt: Date | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    conversationId: string | null
    messageType: $Enums.MessageType | null
    senderId: string | null
    senderUsername: string | null
    content: string | null
    mediaUrl: string | null
    status: $Enums.MsgStatus | null
    isDeleted: boolean | null
    deletedAt: Date | null
    replyTo: string | null
    createdAt: Date | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    conversationId: number
    messageType: number
    senderId: number
    senderUsername: number
    content: number
    mediaUrl: number
    status: number
    isDeleted: number
    deletedAt: number
    reactions: number
    replyTo: number
    createdAt: number
    _all: number
  }


  export type MessageMinAggregateInputType = {
    id?: true
    conversationId?: true
    messageType?: true
    senderId?: true
    senderUsername?: true
    content?: true
    mediaUrl?: true
    status?: true
    isDeleted?: true
    deletedAt?: true
    replyTo?: true
    createdAt?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    conversationId?: true
    messageType?: true
    senderId?: true
    senderUsername?: true
    content?: true
    mediaUrl?: true
    status?: true
    isDeleted?: true
    deletedAt?: true
    replyTo?: true
    createdAt?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    conversationId?: true
    messageType?: true
    senderId?: true
    senderUsername?: true
    content?: true
    mediaUrl?: true
    status?: true
    isDeleted?: true
    deletedAt?: true
    reactions?: true
    replyTo?: true
    createdAt?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: string
    conversationId: string
    messageType: $Enums.MessageType
    senderId: string
    senderUsername: string
    content: string
    mediaUrl: string | null
    status: $Enums.MsgStatus
    isDeleted: boolean
    deletedAt: Date | null
    reactions: JsonValue | null
    replyTo: string | null
    createdAt: Date
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    messageType?: boolean
    senderId?: boolean
    senderUsername?: boolean
    content?: boolean
    mediaUrl?: boolean
    status?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    reactions?: boolean
    replyTo?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["message"]>



  export type MessageSelectScalar = {
    id?: boolean
    conversationId?: boolean
    messageType?: boolean
    senderId?: boolean
    senderUsername?: boolean
    content?: boolean
    mediaUrl?: boolean
    status?: boolean
    isDeleted?: boolean
    deletedAt?: boolean
    reactions?: boolean
    replyTo?: boolean
    createdAt?: boolean
  }

  export type MessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "conversationId" | "messageType" | "senderId" | "senderUsername" | "content" | "mediaUrl" | "status" | "isDeleted" | "deletedAt" | "reactions" | "replyTo" | "createdAt", ExtArgs["result"]["message"]>

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      conversationId: string
      messageType: $Enums.MessageType
      senderId: string
      senderUsername: string
      content: string
      mediaUrl: string | null
      status: $Enums.MsgStatus
      isDeleted: boolean
      deletedAt: Date | null
      reactions: Prisma.JsonValue | null
      replyTo: string | null
      createdAt: Date
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messages that matches the filter.
     * @param {MessageFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const message = await prisma.message.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: MessageFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Message.
     * @param {MessageAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const message = await prisma.message.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: MessageAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Message model
   */
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'String'>
    readonly conversationId: FieldRef<"Message", 'String'>
    readonly messageType: FieldRef<"Message", 'MessageType'>
    readonly senderId: FieldRef<"Message", 'String'>
    readonly senderUsername: FieldRef<"Message", 'String'>
    readonly content: FieldRef<"Message", 'String'>
    readonly mediaUrl: FieldRef<"Message", 'String'>
    readonly status: FieldRef<"Message", 'MsgStatus'>
    readonly isDeleted: FieldRef<"Message", 'Boolean'>
    readonly deletedAt: FieldRef<"Message", 'DateTime'>
    readonly reactions: FieldRef<"Message", 'Json'>
    readonly replyTo: FieldRef<"Message", 'String'>
    readonly createdAt: FieldRef<"Message", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to delete.
     */
    limit?: number
  }

  /**
   * Message findRaw
   */
  export type MessageFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Message aggregateRaw
   */
  export type MessageAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
  }


  /**
   * Model MessageReadStatus
   */

  export type AggregateMessageReadStatus = {
    _count: MessageReadStatusCountAggregateOutputType | null
    _min: MessageReadStatusMinAggregateOutputType | null
    _max: MessageReadStatusMaxAggregateOutputType | null
  }

  export type MessageReadStatusMinAggregateOutputType = {
    id: string | null
    messageId: string | null
    userId: string | null
    status: $Enums.MsgStatus | null
    timestamp: Date | null
  }

  export type MessageReadStatusMaxAggregateOutputType = {
    id: string | null
    messageId: string | null
    userId: string | null
    status: $Enums.MsgStatus | null
    timestamp: Date | null
  }

  export type MessageReadStatusCountAggregateOutputType = {
    id: number
    messageId: number
    userId: number
    status: number
    timestamp: number
    _all: number
  }


  export type MessageReadStatusMinAggregateInputType = {
    id?: true
    messageId?: true
    userId?: true
    status?: true
    timestamp?: true
  }

  export type MessageReadStatusMaxAggregateInputType = {
    id?: true
    messageId?: true
    userId?: true
    status?: true
    timestamp?: true
  }

  export type MessageReadStatusCountAggregateInputType = {
    id?: true
    messageId?: true
    userId?: true
    status?: true
    timestamp?: true
    _all?: true
  }

  export type MessageReadStatusAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MessageReadStatus to aggregate.
     */
    where?: MessageReadStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MessageReadStatuses to fetch.
     */
    orderBy?: MessageReadStatusOrderByWithRelationInput | MessageReadStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageReadStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MessageReadStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MessageReadStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MessageReadStatuses
    **/
    _count?: true | MessageReadStatusCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageReadStatusMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageReadStatusMaxAggregateInputType
  }

  export type GetMessageReadStatusAggregateType<T extends MessageReadStatusAggregateArgs> = {
        [P in keyof T & keyof AggregateMessageReadStatus]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessageReadStatus[P]>
      : GetScalarType<T[P], AggregateMessageReadStatus[P]>
  }




  export type MessageReadStatusGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageReadStatusWhereInput
    orderBy?: MessageReadStatusOrderByWithAggregationInput | MessageReadStatusOrderByWithAggregationInput[]
    by: MessageReadStatusScalarFieldEnum[] | MessageReadStatusScalarFieldEnum
    having?: MessageReadStatusScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageReadStatusCountAggregateInputType | true
    _min?: MessageReadStatusMinAggregateInputType
    _max?: MessageReadStatusMaxAggregateInputType
  }

  export type MessageReadStatusGroupByOutputType = {
    id: string
    messageId: string
    userId: string
    status: $Enums.MsgStatus
    timestamp: Date
    _count: MessageReadStatusCountAggregateOutputType | null
    _min: MessageReadStatusMinAggregateOutputType | null
    _max: MessageReadStatusMaxAggregateOutputType | null
  }

  type GetMessageReadStatusGroupByPayload<T extends MessageReadStatusGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageReadStatusGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageReadStatusGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageReadStatusGroupByOutputType[P]>
            : GetScalarType<T[P], MessageReadStatusGroupByOutputType[P]>
        }
      >
    >


  export type MessageReadStatusSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    messageId?: boolean
    userId?: boolean
    status?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["messageReadStatus"]>



  export type MessageReadStatusSelectScalar = {
    id?: boolean
    messageId?: boolean
    userId?: boolean
    status?: boolean
    timestamp?: boolean
  }

  export type MessageReadStatusOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "messageId" | "userId" | "status" | "timestamp", ExtArgs["result"]["messageReadStatus"]>

  export type $MessageReadStatusPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MessageReadStatus"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      messageId: string
      userId: string
      status: $Enums.MsgStatus
      timestamp: Date
    }, ExtArgs["result"]["messageReadStatus"]>
    composites: {}
  }

  type MessageReadStatusGetPayload<S extends boolean | null | undefined | MessageReadStatusDefaultArgs> = $Result.GetResult<Prisma.$MessageReadStatusPayload, S>

  type MessageReadStatusCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageReadStatusFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageReadStatusCountAggregateInputType | true
    }

  export interface MessageReadStatusDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MessageReadStatus'], meta: { name: 'MessageReadStatus' } }
    /**
     * Find zero or one MessageReadStatus that matches the filter.
     * @param {MessageReadStatusFindUniqueArgs} args - Arguments to find a MessageReadStatus
     * @example
     * // Get one MessageReadStatus
     * const messageReadStatus = await prisma.messageReadStatus.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageReadStatusFindUniqueArgs>(args: SelectSubset<T, MessageReadStatusFindUniqueArgs<ExtArgs>>): Prisma__MessageReadStatusClient<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MessageReadStatus that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageReadStatusFindUniqueOrThrowArgs} args - Arguments to find a MessageReadStatus
     * @example
     * // Get one MessageReadStatus
     * const messageReadStatus = await prisma.messageReadStatus.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageReadStatusFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageReadStatusFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageReadStatusClient<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MessageReadStatus that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageReadStatusFindFirstArgs} args - Arguments to find a MessageReadStatus
     * @example
     * // Get one MessageReadStatus
     * const messageReadStatus = await prisma.messageReadStatus.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageReadStatusFindFirstArgs>(args?: SelectSubset<T, MessageReadStatusFindFirstArgs<ExtArgs>>): Prisma__MessageReadStatusClient<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MessageReadStatus that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageReadStatusFindFirstOrThrowArgs} args - Arguments to find a MessageReadStatus
     * @example
     * // Get one MessageReadStatus
     * const messageReadStatus = await prisma.messageReadStatus.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageReadStatusFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageReadStatusFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageReadStatusClient<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MessageReadStatuses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageReadStatusFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MessageReadStatuses
     * const messageReadStatuses = await prisma.messageReadStatus.findMany()
     * 
     * // Get first 10 MessageReadStatuses
     * const messageReadStatuses = await prisma.messageReadStatus.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageReadStatusWithIdOnly = await prisma.messageReadStatus.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageReadStatusFindManyArgs>(args?: SelectSubset<T, MessageReadStatusFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MessageReadStatus.
     * @param {MessageReadStatusCreateArgs} args - Arguments to create a MessageReadStatus.
     * @example
     * // Create one MessageReadStatus
     * const MessageReadStatus = await prisma.messageReadStatus.create({
     *   data: {
     *     // ... data to create a MessageReadStatus
     *   }
     * })
     * 
     */
    create<T extends MessageReadStatusCreateArgs>(args: SelectSubset<T, MessageReadStatusCreateArgs<ExtArgs>>): Prisma__MessageReadStatusClient<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MessageReadStatuses.
     * @param {MessageReadStatusCreateManyArgs} args - Arguments to create many MessageReadStatuses.
     * @example
     * // Create many MessageReadStatuses
     * const messageReadStatus = await prisma.messageReadStatus.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageReadStatusCreateManyArgs>(args?: SelectSubset<T, MessageReadStatusCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a MessageReadStatus.
     * @param {MessageReadStatusDeleteArgs} args - Arguments to delete one MessageReadStatus.
     * @example
     * // Delete one MessageReadStatus
     * const MessageReadStatus = await prisma.messageReadStatus.delete({
     *   where: {
     *     // ... filter to delete one MessageReadStatus
     *   }
     * })
     * 
     */
    delete<T extends MessageReadStatusDeleteArgs>(args: SelectSubset<T, MessageReadStatusDeleteArgs<ExtArgs>>): Prisma__MessageReadStatusClient<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MessageReadStatus.
     * @param {MessageReadStatusUpdateArgs} args - Arguments to update one MessageReadStatus.
     * @example
     * // Update one MessageReadStatus
     * const messageReadStatus = await prisma.messageReadStatus.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageReadStatusUpdateArgs>(args: SelectSubset<T, MessageReadStatusUpdateArgs<ExtArgs>>): Prisma__MessageReadStatusClient<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MessageReadStatuses.
     * @param {MessageReadStatusDeleteManyArgs} args - Arguments to filter MessageReadStatuses to delete.
     * @example
     * // Delete a few MessageReadStatuses
     * const { count } = await prisma.messageReadStatus.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageReadStatusDeleteManyArgs>(args?: SelectSubset<T, MessageReadStatusDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MessageReadStatuses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageReadStatusUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MessageReadStatuses
     * const messageReadStatus = await prisma.messageReadStatus.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageReadStatusUpdateManyArgs>(args: SelectSubset<T, MessageReadStatusUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MessageReadStatus.
     * @param {MessageReadStatusUpsertArgs} args - Arguments to update or create a MessageReadStatus.
     * @example
     * // Update or create a MessageReadStatus
     * const messageReadStatus = await prisma.messageReadStatus.upsert({
     *   create: {
     *     // ... data to create a MessageReadStatus
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MessageReadStatus we want to update
     *   }
     * })
     */
    upsert<T extends MessageReadStatusUpsertArgs>(args: SelectSubset<T, MessageReadStatusUpsertArgs<ExtArgs>>): Prisma__MessageReadStatusClient<$Result.GetResult<Prisma.$MessageReadStatusPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MessageReadStatuses that matches the filter.
     * @param {MessageReadStatusFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const messageReadStatus = await prisma.messageReadStatus.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: MessageReadStatusFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a MessageReadStatus.
     * @param {MessageReadStatusAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const messageReadStatus = await prisma.messageReadStatus.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: MessageReadStatusAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of MessageReadStatuses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageReadStatusCountArgs} args - Arguments to filter MessageReadStatuses to count.
     * @example
     * // Count the number of MessageReadStatuses
     * const count = await prisma.messageReadStatus.count({
     *   where: {
     *     // ... the filter for the MessageReadStatuses we want to count
     *   }
     * })
    **/
    count<T extends MessageReadStatusCountArgs>(
      args?: Subset<T, MessageReadStatusCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageReadStatusCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MessageReadStatus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageReadStatusAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageReadStatusAggregateArgs>(args: Subset<T, MessageReadStatusAggregateArgs>): Prisma.PrismaPromise<GetMessageReadStatusAggregateType<T>>

    /**
     * Group by MessageReadStatus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageReadStatusGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageReadStatusGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageReadStatusGroupByArgs['orderBy'] }
        : { orderBy?: MessageReadStatusGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageReadStatusGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageReadStatusGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MessageReadStatus model
   */
  readonly fields: MessageReadStatusFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MessageReadStatus.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageReadStatusClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MessageReadStatus model
   */
  interface MessageReadStatusFieldRefs {
    readonly id: FieldRef<"MessageReadStatus", 'String'>
    readonly messageId: FieldRef<"MessageReadStatus", 'String'>
    readonly userId: FieldRef<"MessageReadStatus", 'String'>
    readonly status: FieldRef<"MessageReadStatus", 'MsgStatus'>
    readonly timestamp: FieldRef<"MessageReadStatus", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MessageReadStatus findUnique
   */
  export type MessageReadStatusFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Filter, which MessageReadStatus to fetch.
     */
    where: MessageReadStatusWhereUniqueInput
  }

  /**
   * MessageReadStatus findUniqueOrThrow
   */
  export type MessageReadStatusFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Filter, which MessageReadStatus to fetch.
     */
    where: MessageReadStatusWhereUniqueInput
  }

  /**
   * MessageReadStatus findFirst
   */
  export type MessageReadStatusFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Filter, which MessageReadStatus to fetch.
     */
    where?: MessageReadStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MessageReadStatuses to fetch.
     */
    orderBy?: MessageReadStatusOrderByWithRelationInput | MessageReadStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MessageReadStatuses.
     */
    cursor?: MessageReadStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MessageReadStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MessageReadStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MessageReadStatuses.
     */
    distinct?: MessageReadStatusScalarFieldEnum | MessageReadStatusScalarFieldEnum[]
  }

  /**
   * MessageReadStatus findFirstOrThrow
   */
  export type MessageReadStatusFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Filter, which MessageReadStatus to fetch.
     */
    where?: MessageReadStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MessageReadStatuses to fetch.
     */
    orderBy?: MessageReadStatusOrderByWithRelationInput | MessageReadStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MessageReadStatuses.
     */
    cursor?: MessageReadStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MessageReadStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MessageReadStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MessageReadStatuses.
     */
    distinct?: MessageReadStatusScalarFieldEnum | MessageReadStatusScalarFieldEnum[]
  }

  /**
   * MessageReadStatus findMany
   */
  export type MessageReadStatusFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Filter, which MessageReadStatuses to fetch.
     */
    where?: MessageReadStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MessageReadStatuses to fetch.
     */
    orderBy?: MessageReadStatusOrderByWithRelationInput | MessageReadStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MessageReadStatuses.
     */
    cursor?: MessageReadStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MessageReadStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MessageReadStatuses.
     */
    skip?: number
    distinct?: MessageReadStatusScalarFieldEnum | MessageReadStatusScalarFieldEnum[]
  }

  /**
   * MessageReadStatus create
   */
  export type MessageReadStatusCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * The data needed to create a MessageReadStatus.
     */
    data: XOR<MessageReadStatusCreateInput, MessageReadStatusUncheckedCreateInput>
  }

  /**
   * MessageReadStatus createMany
   */
  export type MessageReadStatusCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MessageReadStatuses.
     */
    data: MessageReadStatusCreateManyInput | MessageReadStatusCreateManyInput[]
  }

  /**
   * MessageReadStatus update
   */
  export type MessageReadStatusUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * The data needed to update a MessageReadStatus.
     */
    data: XOR<MessageReadStatusUpdateInput, MessageReadStatusUncheckedUpdateInput>
    /**
     * Choose, which MessageReadStatus to update.
     */
    where: MessageReadStatusWhereUniqueInput
  }

  /**
   * MessageReadStatus updateMany
   */
  export type MessageReadStatusUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MessageReadStatuses.
     */
    data: XOR<MessageReadStatusUpdateManyMutationInput, MessageReadStatusUncheckedUpdateManyInput>
    /**
     * Filter which MessageReadStatuses to update
     */
    where?: MessageReadStatusWhereInput
    /**
     * Limit how many MessageReadStatuses to update.
     */
    limit?: number
  }

  /**
   * MessageReadStatus upsert
   */
  export type MessageReadStatusUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * The filter to search for the MessageReadStatus to update in case it exists.
     */
    where: MessageReadStatusWhereUniqueInput
    /**
     * In case the MessageReadStatus found by the `where` argument doesn't exist, create a new MessageReadStatus with this data.
     */
    create: XOR<MessageReadStatusCreateInput, MessageReadStatusUncheckedCreateInput>
    /**
     * In case the MessageReadStatus was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageReadStatusUpdateInput, MessageReadStatusUncheckedUpdateInput>
  }

  /**
   * MessageReadStatus delete
   */
  export type MessageReadStatusDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
    /**
     * Filter which MessageReadStatus to delete.
     */
    where: MessageReadStatusWhereUniqueInput
  }

  /**
   * MessageReadStatus deleteMany
   */
  export type MessageReadStatusDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MessageReadStatuses to delete
     */
    where?: MessageReadStatusWhereInput
    /**
     * Limit how many MessageReadStatuses to delete.
     */
    limit?: number
  }

  /**
   * MessageReadStatus findRaw
   */
  export type MessageReadStatusFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * MessageReadStatus aggregateRaw
   */
  export type MessageReadStatusAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * MessageReadStatus without action
   */
  export type MessageReadStatusDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageReadStatus
     */
    select?: MessageReadStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MessageReadStatus
     */
    omit?: MessageReadStatusOmit<ExtArgs> | null
  }


  /**
   * Model UnreadCount
   */

  export type AggregateUnreadCount = {
    _count: UnreadCountCountAggregateOutputType | null
    _avg: UnreadCountAvgAggregateOutputType | null
    _sum: UnreadCountSumAggregateOutputType | null
    _min: UnreadCountMinAggregateOutputType | null
    _max: UnreadCountMaxAggregateOutputType | null
  }

  export type UnreadCountAvgAggregateOutputType = {
    count: number | null
  }

  export type UnreadCountSumAggregateOutputType = {
    count: number | null
  }

  export type UnreadCountMinAggregateOutputType = {
    id: string | null
    conversationId: string | null
    userId: string | null
    count: number | null
    lastReadAt: Date | null
  }

  export type UnreadCountMaxAggregateOutputType = {
    id: string | null
    conversationId: string | null
    userId: string | null
    count: number | null
    lastReadAt: Date | null
  }

  export type UnreadCountCountAggregateOutputType = {
    id: number
    conversationId: number
    userId: number
    count: number
    lastReadAt: number
    _all: number
  }


  export type UnreadCountAvgAggregateInputType = {
    count?: true
  }

  export type UnreadCountSumAggregateInputType = {
    count?: true
  }

  export type UnreadCountMinAggregateInputType = {
    id?: true
    conversationId?: true
    userId?: true
    count?: true
    lastReadAt?: true
  }

  export type UnreadCountMaxAggregateInputType = {
    id?: true
    conversationId?: true
    userId?: true
    count?: true
    lastReadAt?: true
  }

  export type UnreadCountCountAggregateInputType = {
    id?: true
    conversationId?: true
    userId?: true
    count?: true
    lastReadAt?: true
    _all?: true
  }

  export type UnreadCountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UnreadCount to aggregate.
     */
    where?: UnreadCountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnreadCounts to fetch.
     */
    orderBy?: UnreadCountOrderByWithRelationInput | UnreadCountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UnreadCountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnreadCounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnreadCounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UnreadCounts
    **/
    _count?: true | UnreadCountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UnreadCountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UnreadCountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UnreadCountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UnreadCountMaxAggregateInputType
  }

  export type GetUnreadCountAggregateType<T extends UnreadCountAggregateArgs> = {
        [P in keyof T & keyof AggregateUnreadCount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUnreadCount[P]>
      : GetScalarType<T[P], AggregateUnreadCount[P]>
  }




  export type UnreadCountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UnreadCountWhereInput
    orderBy?: UnreadCountOrderByWithAggregationInput | UnreadCountOrderByWithAggregationInput[]
    by: UnreadCountScalarFieldEnum[] | UnreadCountScalarFieldEnum
    having?: UnreadCountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UnreadCountCountAggregateInputType | true
    _avg?: UnreadCountAvgAggregateInputType
    _sum?: UnreadCountSumAggregateInputType
    _min?: UnreadCountMinAggregateInputType
    _max?: UnreadCountMaxAggregateInputType
  }

  export type UnreadCountGroupByOutputType = {
    id: string
    conversationId: string
    userId: string
    count: number
    lastReadAt: Date | null
    _count: UnreadCountCountAggregateOutputType | null
    _avg: UnreadCountAvgAggregateOutputType | null
    _sum: UnreadCountSumAggregateOutputType | null
    _min: UnreadCountMinAggregateOutputType | null
    _max: UnreadCountMaxAggregateOutputType | null
  }

  type GetUnreadCountGroupByPayload<T extends UnreadCountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UnreadCountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UnreadCountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UnreadCountGroupByOutputType[P]>
            : GetScalarType<T[P], UnreadCountGroupByOutputType[P]>
        }
      >
    >


  export type UnreadCountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    userId?: boolean
    count?: boolean
    lastReadAt?: boolean
  }, ExtArgs["result"]["unreadCount"]>



  export type UnreadCountSelectScalar = {
    id?: boolean
    conversationId?: boolean
    userId?: boolean
    count?: boolean
    lastReadAt?: boolean
  }

  export type UnreadCountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "conversationId" | "userId" | "count" | "lastReadAt", ExtArgs["result"]["unreadCount"]>

  export type $UnreadCountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UnreadCount"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      conversationId: string
      userId: string
      count: number
      lastReadAt: Date | null
    }, ExtArgs["result"]["unreadCount"]>
    composites: {}
  }

  type UnreadCountGetPayload<S extends boolean | null | undefined | UnreadCountDefaultArgs> = $Result.GetResult<Prisma.$UnreadCountPayload, S>

  type UnreadCountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UnreadCountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UnreadCountCountAggregateInputType | true
    }

  export interface UnreadCountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UnreadCount'], meta: { name: 'UnreadCount' } }
    /**
     * Find zero or one UnreadCount that matches the filter.
     * @param {UnreadCountFindUniqueArgs} args - Arguments to find a UnreadCount
     * @example
     * // Get one UnreadCount
     * const unreadCount = await prisma.unreadCount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UnreadCountFindUniqueArgs>(args: SelectSubset<T, UnreadCountFindUniqueArgs<ExtArgs>>): Prisma__UnreadCountClient<$Result.GetResult<Prisma.$UnreadCountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UnreadCount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UnreadCountFindUniqueOrThrowArgs} args - Arguments to find a UnreadCount
     * @example
     * // Get one UnreadCount
     * const unreadCount = await prisma.unreadCount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UnreadCountFindUniqueOrThrowArgs>(args: SelectSubset<T, UnreadCountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UnreadCountClient<$Result.GetResult<Prisma.$UnreadCountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UnreadCount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnreadCountFindFirstArgs} args - Arguments to find a UnreadCount
     * @example
     * // Get one UnreadCount
     * const unreadCount = await prisma.unreadCount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UnreadCountFindFirstArgs>(args?: SelectSubset<T, UnreadCountFindFirstArgs<ExtArgs>>): Prisma__UnreadCountClient<$Result.GetResult<Prisma.$UnreadCountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UnreadCount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnreadCountFindFirstOrThrowArgs} args - Arguments to find a UnreadCount
     * @example
     * // Get one UnreadCount
     * const unreadCount = await prisma.unreadCount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UnreadCountFindFirstOrThrowArgs>(args?: SelectSubset<T, UnreadCountFindFirstOrThrowArgs<ExtArgs>>): Prisma__UnreadCountClient<$Result.GetResult<Prisma.$UnreadCountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UnreadCounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnreadCountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UnreadCounts
     * const unreadCounts = await prisma.unreadCount.findMany()
     * 
     * // Get first 10 UnreadCounts
     * const unreadCounts = await prisma.unreadCount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const unreadCountWithIdOnly = await prisma.unreadCount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UnreadCountFindManyArgs>(args?: SelectSubset<T, UnreadCountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnreadCountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UnreadCount.
     * @param {UnreadCountCreateArgs} args - Arguments to create a UnreadCount.
     * @example
     * // Create one UnreadCount
     * const UnreadCount = await prisma.unreadCount.create({
     *   data: {
     *     // ... data to create a UnreadCount
     *   }
     * })
     * 
     */
    create<T extends UnreadCountCreateArgs>(args: SelectSubset<T, UnreadCountCreateArgs<ExtArgs>>): Prisma__UnreadCountClient<$Result.GetResult<Prisma.$UnreadCountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UnreadCounts.
     * @param {UnreadCountCreateManyArgs} args - Arguments to create many UnreadCounts.
     * @example
     * // Create many UnreadCounts
     * const unreadCount = await prisma.unreadCount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UnreadCountCreateManyArgs>(args?: SelectSubset<T, UnreadCountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a UnreadCount.
     * @param {UnreadCountDeleteArgs} args - Arguments to delete one UnreadCount.
     * @example
     * // Delete one UnreadCount
     * const UnreadCount = await prisma.unreadCount.delete({
     *   where: {
     *     // ... filter to delete one UnreadCount
     *   }
     * })
     * 
     */
    delete<T extends UnreadCountDeleteArgs>(args: SelectSubset<T, UnreadCountDeleteArgs<ExtArgs>>): Prisma__UnreadCountClient<$Result.GetResult<Prisma.$UnreadCountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UnreadCount.
     * @param {UnreadCountUpdateArgs} args - Arguments to update one UnreadCount.
     * @example
     * // Update one UnreadCount
     * const unreadCount = await prisma.unreadCount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UnreadCountUpdateArgs>(args: SelectSubset<T, UnreadCountUpdateArgs<ExtArgs>>): Prisma__UnreadCountClient<$Result.GetResult<Prisma.$UnreadCountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UnreadCounts.
     * @param {UnreadCountDeleteManyArgs} args - Arguments to filter UnreadCounts to delete.
     * @example
     * // Delete a few UnreadCounts
     * const { count } = await prisma.unreadCount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UnreadCountDeleteManyArgs>(args?: SelectSubset<T, UnreadCountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UnreadCounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnreadCountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UnreadCounts
     * const unreadCount = await prisma.unreadCount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UnreadCountUpdateManyArgs>(args: SelectSubset<T, UnreadCountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UnreadCount.
     * @param {UnreadCountUpsertArgs} args - Arguments to update or create a UnreadCount.
     * @example
     * // Update or create a UnreadCount
     * const unreadCount = await prisma.unreadCount.upsert({
     *   create: {
     *     // ... data to create a UnreadCount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UnreadCount we want to update
     *   }
     * })
     */
    upsert<T extends UnreadCountUpsertArgs>(args: SelectSubset<T, UnreadCountUpsertArgs<ExtArgs>>): Prisma__UnreadCountClient<$Result.GetResult<Prisma.$UnreadCountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UnreadCounts that matches the filter.
     * @param {UnreadCountFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const unreadCount = await prisma.unreadCount.findRaw({
     *   filter: { age: { $gt: 25 } }
     * })
     */
    findRaw(args?: UnreadCountFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a UnreadCount.
     * @param {UnreadCountAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const unreadCount = await prisma.unreadCount.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: UnreadCountAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of UnreadCounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnreadCountCountArgs} args - Arguments to filter UnreadCounts to count.
     * @example
     * // Count the number of UnreadCounts
     * const count = await prisma.unreadCount.count({
     *   where: {
     *     // ... the filter for the UnreadCounts we want to count
     *   }
     * })
    **/
    count<T extends UnreadCountCountArgs>(
      args?: Subset<T, UnreadCountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UnreadCountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UnreadCount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnreadCountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UnreadCountAggregateArgs>(args: Subset<T, UnreadCountAggregateArgs>): Prisma.PrismaPromise<GetUnreadCountAggregateType<T>>

    /**
     * Group by UnreadCount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnreadCountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UnreadCountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UnreadCountGroupByArgs['orderBy'] }
        : { orderBy?: UnreadCountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UnreadCountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUnreadCountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UnreadCount model
   */
  readonly fields: UnreadCountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UnreadCount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UnreadCountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UnreadCount model
   */
  interface UnreadCountFieldRefs {
    readonly id: FieldRef<"UnreadCount", 'String'>
    readonly conversationId: FieldRef<"UnreadCount", 'String'>
    readonly userId: FieldRef<"UnreadCount", 'String'>
    readonly count: FieldRef<"UnreadCount", 'Int'>
    readonly lastReadAt: FieldRef<"UnreadCount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UnreadCount findUnique
   */
  export type UnreadCountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnreadCount
     */
    select?: UnreadCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnreadCount
     */
    omit?: UnreadCountOmit<ExtArgs> | null
    /**
     * Filter, which UnreadCount to fetch.
     */
    where: UnreadCountWhereUniqueInput
  }

  /**
   * UnreadCount findUniqueOrThrow
   */
  export type UnreadCountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnreadCount
     */
    select?: UnreadCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnreadCount
     */
    omit?: UnreadCountOmit<ExtArgs> | null
    /**
     * Filter, which UnreadCount to fetch.
     */
    where: UnreadCountWhereUniqueInput
  }

  /**
   * UnreadCount findFirst
   */
  export type UnreadCountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnreadCount
     */
    select?: UnreadCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnreadCount
     */
    omit?: UnreadCountOmit<ExtArgs> | null
    /**
     * Filter, which UnreadCount to fetch.
     */
    where?: UnreadCountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnreadCounts to fetch.
     */
    orderBy?: UnreadCountOrderByWithRelationInput | UnreadCountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UnreadCounts.
     */
    cursor?: UnreadCountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnreadCounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnreadCounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UnreadCounts.
     */
    distinct?: UnreadCountScalarFieldEnum | UnreadCountScalarFieldEnum[]
  }

  /**
   * UnreadCount findFirstOrThrow
   */
  export type UnreadCountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnreadCount
     */
    select?: UnreadCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnreadCount
     */
    omit?: UnreadCountOmit<ExtArgs> | null
    /**
     * Filter, which UnreadCount to fetch.
     */
    where?: UnreadCountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnreadCounts to fetch.
     */
    orderBy?: UnreadCountOrderByWithRelationInput | UnreadCountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UnreadCounts.
     */
    cursor?: UnreadCountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnreadCounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnreadCounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UnreadCounts.
     */
    distinct?: UnreadCountScalarFieldEnum | UnreadCountScalarFieldEnum[]
  }

  /**
   * UnreadCount findMany
   */
  export type UnreadCountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnreadCount
     */
    select?: UnreadCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnreadCount
     */
    omit?: UnreadCountOmit<ExtArgs> | null
    /**
     * Filter, which UnreadCounts to fetch.
     */
    where?: UnreadCountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnreadCounts to fetch.
     */
    orderBy?: UnreadCountOrderByWithRelationInput | UnreadCountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UnreadCounts.
     */
    cursor?: UnreadCountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnreadCounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnreadCounts.
     */
    skip?: number
    distinct?: UnreadCountScalarFieldEnum | UnreadCountScalarFieldEnum[]
  }

  /**
   * UnreadCount create
   */
  export type UnreadCountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnreadCount
     */
    select?: UnreadCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnreadCount
     */
    omit?: UnreadCountOmit<ExtArgs> | null
    /**
     * The data needed to create a UnreadCount.
     */
    data: XOR<UnreadCountCreateInput, UnreadCountUncheckedCreateInput>
  }

  /**
   * UnreadCount createMany
   */
  export type UnreadCountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UnreadCounts.
     */
    data: UnreadCountCreateManyInput | UnreadCountCreateManyInput[]
  }

  /**
   * UnreadCount update
   */
  export type UnreadCountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnreadCount
     */
    select?: UnreadCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnreadCount
     */
    omit?: UnreadCountOmit<ExtArgs> | null
    /**
     * The data needed to update a UnreadCount.
     */
    data: XOR<UnreadCountUpdateInput, UnreadCountUncheckedUpdateInput>
    /**
     * Choose, which UnreadCount to update.
     */
    where: UnreadCountWhereUniqueInput
  }

  /**
   * UnreadCount updateMany
   */
  export type UnreadCountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UnreadCounts.
     */
    data: XOR<UnreadCountUpdateManyMutationInput, UnreadCountUncheckedUpdateManyInput>
    /**
     * Filter which UnreadCounts to update
     */
    where?: UnreadCountWhereInput
    /**
     * Limit how many UnreadCounts to update.
     */
    limit?: number
  }

  /**
   * UnreadCount upsert
   */
  export type UnreadCountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnreadCount
     */
    select?: UnreadCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnreadCount
     */
    omit?: UnreadCountOmit<ExtArgs> | null
    /**
     * The filter to search for the UnreadCount to update in case it exists.
     */
    where: UnreadCountWhereUniqueInput
    /**
     * In case the UnreadCount found by the `where` argument doesn't exist, create a new UnreadCount with this data.
     */
    create: XOR<UnreadCountCreateInput, UnreadCountUncheckedCreateInput>
    /**
     * In case the UnreadCount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UnreadCountUpdateInput, UnreadCountUncheckedUpdateInput>
  }

  /**
   * UnreadCount delete
   */
  export type UnreadCountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnreadCount
     */
    select?: UnreadCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnreadCount
     */
    omit?: UnreadCountOmit<ExtArgs> | null
    /**
     * Filter which UnreadCount to delete.
     */
    where: UnreadCountWhereUniqueInput
  }

  /**
   * UnreadCount deleteMany
   */
  export type UnreadCountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UnreadCounts to delete
     */
    where?: UnreadCountWhereInput
    /**
     * Limit how many UnreadCounts to delete.
     */
    limit?: number
  }

  /**
   * UnreadCount findRaw
   */
  export type UnreadCountFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * UnreadCount aggregateRaw
   */
  export type UnreadCountAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * UnreadCount without action
   */
  export type UnreadCountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnreadCount
     */
    select?: UnreadCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnreadCount
     */
    omit?: UnreadCountOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const ConversationScalarFieldEnum: {
    id: 'id',
    conversationId: 'conversationId',
    chatType: 'chatType',
    participants: 'participants',
    lastMessage: 'lastMessage',
    lastMessageBy: 'lastMessageBy',
    lastMessageAt: 'lastMessageAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ConversationScalarFieldEnum = (typeof ConversationScalarFieldEnum)[keyof typeof ConversationScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    id: 'id',
    conversationId: 'conversationId',
    messageType: 'messageType',
    senderId: 'senderId',
    senderUsername: 'senderUsername',
    content: 'content',
    mediaUrl: 'mediaUrl',
    status: 'status',
    isDeleted: 'isDeleted',
    deletedAt: 'deletedAt',
    reactions: 'reactions',
    replyTo: 'replyTo',
    createdAt: 'createdAt'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const MessageReadStatusScalarFieldEnum: {
    id: 'id',
    messageId: 'messageId',
    userId: 'userId',
    status: 'status',
    timestamp: 'timestamp'
  };

  export type MessageReadStatusScalarFieldEnum = (typeof MessageReadStatusScalarFieldEnum)[keyof typeof MessageReadStatusScalarFieldEnum]


  export const UnreadCountScalarFieldEnum: {
    id: 'id',
    conversationId: 'conversationId',
    userId: 'userId',
    count: 'count',
    lastReadAt: 'lastReadAt'
  };

  export type UnreadCountScalarFieldEnum = (typeof UnreadCountScalarFieldEnum)[keyof typeof UnreadCountScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'ChatType'
   */
  export type EnumChatTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChatType'>
    


  /**
   * Reference to a field of type 'ChatType[]'
   */
  export type ListEnumChatTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ChatType[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'MessageType'
   */
  export type EnumMessageTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageType'>
    


  /**
   * Reference to a field of type 'MessageType[]'
   */
  export type ListEnumMessageTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageType[]'>
    


  /**
   * Reference to a field of type 'MsgStatus'
   */
  export type EnumMsgStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MsgStatus'>
    


  /**
   * Reference to a field of type 'MsgStatus[]'
   */
  export type ListEnumMsgStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MsgStatus[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ConversationWhereInput = {
    AND?: ConversationWhereInput | ConversationWhereInput[]
    OR?: ConversationWhereInput[]
    NOT?: ConversationWhereInput | ConversationWhereInput[]
    id?: StringFilter<"Conversation"> | string
    conversationId?: StringFilter<"Conversation"> | string
    chatType?: EnumChatTypeFilter<"Conversation"> | $Enums.ChatType
    participants?: StringNullableListFilter<"Conversation">
    lastMessage?: StringNullableFilter<"Conversation"> | string | null
    lastMessageBy?: StringNullableFilter<"Conversation"> | string | null
    lastMessageAt?: DateTimeNullableFilter<"Conversation"> | Date | string | null
    createdAt?: DateTimeFilter<"Conversation"> | Date | string
    updatedAt?: DateTimeFilter<"Conversation"> | Date | string
  }

  export type ConversationOrderByWithRelationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    chatType?: SortOrder
    participants?: SortOrder
    lastMessage?: SortOrder
    lastMessageBy?: SortOrder
    lastMessageAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    conversationId?: string
    AND?: ConversationWhereInput | ConversationWhereInput[]
    OR?: ConversationWhereInput[]
    NOT?: ConversationWhereInput | ConversationWhereInput[]
    chatType?: EnumChatTypeFilter<"Conversation"> | $Enums.ChatType
    participants?: StringNullableListFilter<"Conversation">
    lastMessage?: StringNullableFilter<"Conversation"> | string | null
    lastMessageBy?: StringNullableFilter<"Conversation"> | string | null
    lastMessageAt?: DateTimeNullableFilter<"Conversation"> | Date | string | null
    createdAt?: DateTimeFilter<"Conversation"> | Date | string
    updatedAt?: DateTimeFilter<"Conversation"> | Date | string
  }, "id" | "conversationId">

  export type ConversationOrderByWithAggregationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    chatType?: SortOrder
    participants?: SortOrder
    lastMessage?: SortOrder
    lastMessageBy?: SortOrder
    lastMessageAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ConversationCountOrderByAggregateInput
    _max?: ConversationMaxOrderByAggregateInput
    _min?: ConversationMinOrderByAggregateInput
  }

  export type ConversationScalarWhereWithAggregatesInput = {
    AND?: ConversationScalarWhereWithAggregatesInput | ConversationScalarWhereWithAggregatesInput[]
    OR?: ConversationScalarWhereWithAggregatesInput[]
    NOT?: ConversationScalarWhereWithAggregatesInput | ConversationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Conversation"> | string
    conversationId?: StringWithAggregatesFilter<"Conversation"> | string
    chatType?: EnumChatTypeWithAggregatesFilter<"Conversation"> | $Enums.ChatType
    participants?: StringNullableListFilter<"Conversation">
    lastMessage?: StringNullableWithAggregatesFilter<"Conversation"> | string | null
    lastMessageBy?: StringNullableWithAggregatesFilter<"Conversation"> | string | null
    lastMessageAt?: DateTimeNullableWithAggregatesFilter<"Conversation"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Conversation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Conversation"> | Date | string
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: StringFilter<"Message"> | string
    conversationId?: StringFilter<"Message"> | string
    messageType?: EnumMessageTypeFilter<"Message"> | $Enums.MessageType
    senderId?: StringFilter<"Message"> | string
    senderUsername?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    mediaUrl?: StringNullableFilter<"Message"> | string | null
    status?: EnumMsgStatusFilter<"Message"> | $Enums.MsgStatus
    isDeleted?: BoolFilter<"Message"> | boolean
    deletedAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    reactions?: JsonNullableFilter<"Message">
    replyTo?: StringNullableFilter<"Message"> | string | null
    createdAt?: DateTimeFilter<"Message"> | Date | string
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    messageType?: SortOrder
    senderId?: SortOrder
    senderUsername?: SortOrder
    content?: SortOrder
    mediaUrl?: SortOrder
    status?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
    reactions?: SortOrder
    replyTo?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    conversationId?: StringFilter<"Message"> | string
    messageType?: EnumMessageTypeFilter<"Message"> | $Enums.MessageType
    senderId?: StringFilter<"Message"> | string
    senderUsername?: StringFilter<"Message"> | string
    content?: StringFilter<"Message"> | string
    mediaUrl?: StringNullableFilter<"Message"> | string | null
    status?: EnumMsgStatusFilter<"Message"> | $Enums.MsgStatus
    isDeleted?: BoolFilter<"Message"> | boolean
    deletedAt?: DateTimeNullableFilter<"Message"> | Date | string | null
    reactions?: JsonNullableFilter<"Message">
    replyTo?: StringNullableFilter<"Message"> | string | null
    createdAt?: DateTimeFilter<"Message"> | Date | string
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    messageType?: SortOrder
    senderId?: SortOrder
    senderUsername?: SortOrder
    content?: SortOrder
    mediaUrl?: SortOrder
    status?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
    reactions?: SortOrder
    replyTo?: SortOrder
    createdAt?: SortOrder
    _count?: MessageCountOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Message"> | string
    conversationId?: StringWithAggregatesFilter<"Message"> | string
    messageType?: EnumMessageTypeWithAggregatesFilter<"Message"> | $Enums.MessageType
    senderId?: StringWithAggregatesFilter<"Message"> | string
    senderUsername?: StringWithAggregatesFilter<"Message"> | string
    content?: StringWithAggregatesFilter<"Message"> | string
    mediaUrl?: StringNullableWithAggregatesFilter<"Message"> | string | null
    status?: EnumMsgStatusWithAggregatesFilter<"Message"> | $Enums.MsgStatus
    isDeleted?: BoolWithAggregatesFilter<"Message"> | boolean
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Message"> | Date | string | null
    reactions?: JsonNullableWithAggregatesFilter<"Message">
    replyTo?: StringNullableWithAggregatesFilter<"Message"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
  }

  export type MessageReadStatusWhereInput = {
    AND?: MessageReadStatusWhereInput | MessageReadStatusWhereInput[]
    OR?: MessageReadStatusWhereInput[]
    NOT?: MessageReadStatusWhereInput | MessageReadStatusWhereInput[]
    id?: StringFilter<"MessageReadStatus"> | string
    messageId?: StringFilter<"MessageReadStatus"> | string
    userId?: StringFilter<"MessageReadStatus"> | string
    status?: EnumMsgStatusFilter<"MessageReadStatus"> | $Enums.MsgStatus
    timestamp?: DateTimeFilter<"MessageReadStatus"> | Date | string
  }

  export type MessageReadStatusOrderByWithRelationInput = {
    id?: SortOrder
    messageId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    timestamp?: SortOrder
  }

  export type MessageReadStatusWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    messageId_userId?: MessageReadStatusMessageIdUserIdCompoundUniqueInput
    AND?: MessageReadStatusWhereInput | MessageReadStatusWhereInput[]
    OR?: MessageReadStatusWhereInput[]
    NOT?: MessageReadStatusWhereInput | MessageReadStatusWhereInput[]
    messageId?: StringFilter<"MessageReadStatus"> | string
    userId?: StringFilter<"MessageReadStatus"> | string
    status?: EnumMsgStatusFilter<"MessageReadStatus"> | $Enums.MsgStatus
    timestamp?: DateTimeFilter<"MessageReadStatus"> | Date | string
  }, "id" | "messageId_userId">

  export type MessageReadStatusOrderByWithAggregationInput = {
    id?: SortOrder
    messageId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    timestamp?: SortOrder
    _count?: MessageReadStatusCountOrderByAggregateInput
    _max?: MessageReadStatusMaxOrderByAggregateInput
    _min?: MessageReadStatusMinOrderByAggregateInput
  }

  export type MessageReadStatusScalarWhereWithAggregatesInput = {
    AND?: MessageReadStatusScalarWhereWithAggregatesInput | MessageReadStatusScalarWhereWithAggregatesInput[]
    OR?: MessageReadStatusScalarWhereWithAggregatesInput[]
    NOT?: MessageReadStatusScalarWhereWithAggregatesInput | MessageReadStatusScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MessageReadStatus"> | string
    messageId?: StringWithAggregatesFilter<"MessageReadStatus"> | string
    userId?: StringWithAggregatesFilter<"MessageReadStatus"> | string
    status?: EnumMsgStatusWithAggregatesFilter<"MessageReadStatus"> | $Enums.MsgStatus
    timestamp?: DateTimeWithAggregatesFilter<"MessageReadStatus"> | Date | string
  }

  export type UnreadCountWhereInput = {
    AND?: UnreadCountWhereInput | UnreadCountWhereInput[]
    OR?: UnreadCountWhereInput[]
    NOT?: UnreadCountWhereInput | UnreadCountWhereInput[]
    id?: StringFilter<"UnreadCount"> | string
    conversationId?: StringFilter<"UnreadCount"> | string
    userId?: StringFilter<"UnreadCount"> | string
    count?: IntFilter<"UnreadCount"> | number
    lastReadAt?: DateTimeNullableFilter<"UnreadCount"> | Date | string | null
  }

  export type UnreadCountOrderByWithRelationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    userId?: SortOrder
    count?: SortOrder
    lastReadAt?: SortOrder
  }

  export type UnreadCountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    conversationId_userId?: UnreadCountConversationIdUserIdCompoundUniqueInput
    AND?: UnreadCountWhereInput | UnreadCountWhereInput[]
    OR?: UnreadCountWhereInput[]
    NOT?: UnreadCountWhereInput | UnreadCountWhereInput[]
    conversationId?: StringFilter<"UnreadCount"> | string
    userId?: StringFilter<"UnreadCount"> | string
    count?: IntFilter<"UnreadCount"> | number
    lastReadAt?: DateTimeNullableFilter<"UnreadCount"> | Date | string | null
  }, "id" | "conversationId_userId">

  export type UnreadCountOrderByWithAggregationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    userId?: SortOrder
    count?: SortOrder
    lastReadAt?: SortOrder
    _count?: UnreadCountCountOrderByAggregateInput
    _avg?: UnreadCountAvgOrderByAggregateInput
    _max?: UnreadCountMaxOrderByAggregateInput
    _min?: UnreadCountMinOrderByAggregateInput
    _sum?: UnreadCountSumOrderByAggregateInput
  }

  export type UnreadCountScalarWhereWithAggregatesInput = {
    AND?: UnreadCountScalarWhereWithAggregatesInput | UnreadCountScalarWhereWithAggregatesInput[]
    OR?: UnreadCountScalarWhereWithAggregatesInput[]
    NOT?: UnreadCountScalarWhereWithAggregatesInput | UnreadCountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UnreadCount"> | string
    conversationId?: StringWithAggregatesFilter<"UnreadCount"> | string
    userId?: StringWithAggregatesFilter<"UnreadCount"> | string
    count?: IntWithAggregatesFilter<"UnreadCount"> | number
    lastReadAt?: DateTimeNullableWithAggregatesFilter<"UnreadCount"> | Date | string | null
  }

  export type ConversationCreateInput = {
    id?: string
    conversationId: string
    chatType: $Enums.ChatType
    participants?: ConversationCreateparticipantsInput | string[]
    lastMessage?: string | null
    lastMessageBy?: string | null
    lastMessageAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConversationUncheckedCreateInput = {
    id?: string
    conversationId: string
    chatType: $Enums.ChatType
    participants?: ConversationCreateparticipantsInput | string[]
    lastMessage?: string | null
    lastMessageBy?: string | null
    lastMessageAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConversationUpdateInput = {
    conversationId?: StringFieldUpdateOperationsInput | string
    chatType?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    participants?: ConversationUpdateparticipantsInput | string[]
    lastMessage?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageBy?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationUncheckedUpdateInput = {
    conversationId?: StringFieldUpdateOperationsInput | string
    chatType?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    participants?: ConversationUpdateparticipantsInput | string[]
    lastMessage?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageBy?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationCreateManyInput = {
    id?: string
    conversationId: string
    chatType: $Enums.ChatType
    participants?: ConversationCreateparticipantsInput | string[]
    lastMessage?: string | null
    lastMessageBy?: string | null
    lastMessageAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConversationUpdateManyMutationInput = {
    conversationId?: StringFieldUpdateOperationsInput | string
    chatType?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    participants?: ConversationUpdateparticipantsInput | string[]
    lastMessage?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageBy?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationUncheckedUpdateManyInput = {
    conversationId?: StringFieldUpdateOperationsInput | string
    chatType?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType
    participants?: ConversationUpdateparticipantsInput | string[]
    lastMessage?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageBy?: NullableStringFieldUpdateOperationsInput | string | null
    lastMessageAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateInput = {
    id?: string
    conversationId: string
    messageType?: $Enums.MessageType
    senderId: string
    senderUsername: string
    content: string
    mediaUrl?: string | null
    status?: $Enums.MsgStatus
    isDeleted?: boolean
    deletedAt?: Date | string | null
    reactions?: InputJsonValue | null
    replyTo?: string | null
    createdAt?: Date | string
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    conversationId: string
    messageType?: $Enums.MessageType
    senderId: string
    senderUsername: string
    content: string
    mediaUrl?: string | null
    status?: $Enums.MsgStatus
    isDeleted?: boolean
    deletedAt?: Date | string | null
    reactions?: InputJsonValue | null
    replyTo?: string | null
    createdAt?: Date | string
  }

  export type MessageUpdateInput = {
    conversationId?: StringFieldUpdateOperationsInput | string
    messageType?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    senderId?: StringFieldUpdateOperationsInput | string
    senderUsername?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMsgStatusFieldUpdateOperationsInput | $Enums.MsgStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reactions?: InputJsonValue | InputJsonValue | null
    replyTo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateInput = {
    conversationId?: StringFieldUpdateOperationsInput | string
    messageType?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    senderId?: StringFieldUpdateOperationsInput | string
    senderUsername?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMsgStatusFieldUpdateOperationsInput | $Enums.MsgStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reactions?: InputJsonValue | InputJsonValue | null
    replyTo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyInput = {
    id?: string
    conversationId: string
    messageType?: $Enums.MessageType
    senderId: string
    senderUsername: string
    content: string
    mediaUrl?: string | null
    status?: $Enums.MsgStatus
    isDeleted?: boolean
    deletedAt?: Date | string | null
    reactions?: InputJsonValue | null
    replyTo?: string | null
    createdAt?: Date | string
  }

  export type MessageUpdateManyMutationInput = {
    conversationId?: StringFieldUpdateOperationsInput | string
    messageType?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    senderId?: StringFieldUpdateOperationsInput | string
    senderUsername?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMsgStatusFieldUpdateOperationsInput | $Enums.MsgStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reactions?: InputJsonValue | InputJsonValue | null
    replyTo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyInput = {
    conversationId?: StringFieldUpdateOperationsInput | string
    messageType?: EnumMessageTypeFieldUpdateOperationsInput | $Enums.MessageType
    senderId?: StringFieldUpdateOperationsInput | string
    senderUsername?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumMsgStatusFieldUpdateOperationsInput | $Enums.MsgStatus
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reactions?: InputJsonValue | InputJsonValue | null
    replyTo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageReadStatusCreateInput = {
    id?: string
    messageId: string
    userId: string
    status?: $Enums.MsgStatus
    timestamp?: Date | string
  }

  export type MessageReadStatusUncheckedCreateInput = {
    id?: string
    messageId: string
    userId: string
    status?: $Enums.MsgStatus
    timestamp?: Date | string
  }

  export type MessageReadStatusUpdateInput = {
    messageId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumMsgStatusFieldUpdateOperationsInput | $Enums.MsgStatus
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageReadStatusUncheckedUpdateInput = {
    messageId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumMsgStatusFieldUpdateOperationsInput | $Enums.MsgStatus
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageReadStatusCreateManyInput = {
    id?: string
    messageId: string
    userId: string
    status?: $Enums.MsgStatus
    timestamp?: Date | string
  }

  export type MessageReadStatusUpdateManyMutationInput = {
    messageId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumMsgStatusFieldUpdateOperationsInput | $Enums.MsgStatus
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageReadStatusUncheckedUpdateManyInput = {
    messageId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumMsgStatusFieldUpdateOperationsInput | $Enums.MsgStatus
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnreadCountCreateInput = {
    id?: string
    conversationId: string
    userId: string
    count?: number
    lastReadAt?: Date | string | null
  }

  export type UnreadCountUncheckedCreateInput = {
    id?: string
    conversationId: string
    userId: string
    count?: number
    lastReadAt?: Date | string | null
  }

  export type UnreadCountUpdateInput = {
    conversationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UnreadCountUncheckedUpdateInput = {
    conversationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UnreadCountCreateManyInput = {
    id?: string
    conversationId: string
    userId: string
    count?: number
    lastReadAt?: Date | string | null
  }

  export type UnreadCountUpdateManyMutationInput = {
    conversationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UnreadCountUncheckedUpdateManyInput = {
    conversationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    lastReadAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumChatTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatType | EnumChatTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ChatType[] | ListEnumChatTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ChatType[] | ListEnumChatTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumChatTypeFilter<$PrismaModel> | $Enums.ChatType
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
    isSet?: boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ConversationCountOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    chatType?: SortOrder
    participants?: SortOrder
    lastMessage?: SortOrder
    lastMessageBy?: SortOrder
    lastMessageAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConversationMaxOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    chatType?: SortOrder
    lastMessage?: SortOrder
    lastMessageBy?: SortOrder
    lastMessageAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConversationMinOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    chatType?: SortOrder
    lastMessage?: SortOrder
    lastMessageBy?: SortOrder
    lastMessageAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumChatTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatType | EnumChatTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ChatType[] | ListEnumChatTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ChatType[] | ListEnumChatTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumChatTypeWithAggregatesFilter<$PrismaModel> | $Enums.ChatType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumChatTypeFilter<$PrismaModel>
    _max?: NestedEnumChatTypeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumMessageTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | EnumMessageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageTypeFilter<$PrismaModel> | $Enums.MessageType
  }

  export type EnumMsgStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MsgStatus | EnumMsgStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MsgStatus[] | ListEnumMsgStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MsgStatus[] | ListEnumMsgStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMsgStatusFilter<$PrismaModel> | $Enums.MsgStatus
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    isSet?: boolean
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    messageType?: SortOrder
    senderId?: SortOrder
    senderUsername?: SortOrder
    content?: SortOrder
    mediaUrl?: SortOrder
    status?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
    reactions?: SortOrder
    replyTo?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    messageType?: SortOrder
    senderId?: SortOrder
    senderUsername?: SortOrder
    content?: SortOrder
    mediaUrl?: SortOrder
    status?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
    replyTo?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    messageType?: SortOrder
    senderId?: SortOrder
    senderUsername?: SortOrder
    content?: SortOrder
    mediaUrl?: SortOrder
    status?: SortOrder
    isDeleted?: SortOrder
    deletedAt?: SortOrder
    replyTo?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumMessageTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | EnumMessageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageTypeWithAggregatesFilter<$PrismaModel> | $Enums.MessageType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageTypeFilter<$PrismaModel>
    _max?: NestedEnumMessageTypeFilter<$PrismaModel>
  }

  export type EnumMsgStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MsgStatus | EnumMsgStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MsgStatus[] | ListEnumMsgStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MsgStatus[] | ListEnumMsgStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMsgStatusWithAggregatesFilter<$PrismaModel> | $Enums.MsgStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMsgStatusFilter<$PrismaModel>
    _max?: NestedEnumMsgStatusFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type MessageReadStatusMessageIdUserIdCompoundUniqueInput = {
    messageId: string
    userId: string
  }

  export type MessageReadStatusCountOrderByAggregateInput = {
    id?: SortOrder
    messageId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    timestamp?: SortOrder
  }

  export type MessageReadStatusMaxOrderByAggregateInput = {
    id?: SortOrder
    messageId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    timestamp?: SortOrder
  }

  export type MessageReadStatusMinOrderByAggregateInput = {
    id?: SortOrder
    messageId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    timestamp?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UnreadCountConversationIdUserIdCompoundUniqueInput = {
    conversationId: string
    userId: string
  }

  export type UnreadCountCountOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    userId?: SortOrder
    count?: SortOrder
    lastReadAt?: SortOrder
  }

  export type UnreadCountAvgOrderByAggregateInput = {
    count?: SortOrder
  }

  export type UnreadCountMaxOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    userId?: SortOrder
    count?: SortOrder
    lastReadAt?: SortOrder
  }

  export type UnreadCountMinOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    userId?: SortOrder
    count?: SortOrder
    lastReadAt?: SortOrder
  }

  export type UnreadCountSumOrderByAggregateInput = {
    count?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type ConversationCreateparticipantsInput = {
    set: string[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumChatTypeFieldUpdateOperationsInput = {
    set?: $Enums.ChatType
  }

  export type ConversationUpdateparticipantsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
    unset?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
    unset?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnumMessageTypeFieldUpdateOperationsInput = {
    set?: $Enums.MessageType
  }

  export type EnumMsgStatusFieldUpdateOperationsInput = {
    set?: $Enums.MsgStatus
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumChatTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatType | EnumChatTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ChatType[] | ListEnumChatTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ChatType[] | ListEnumChatTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumChatTypeFilter<$PrismaModel> | $Enums.ChatType
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
    isSet?: boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumChatTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatType | EnumChatTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ChatType[] | ListEnumChatTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ChatType[] | ListEnumChatTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumChatTypeWithAggregatesFilter<$PrismaModel> | $Enums.ChatType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumChatTypeFilter<$PrismaModel>
    _max?: NestedEnumChatTypeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumMessageTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | EnumMessageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageTypeFilter<$PrismaModel> | $Enums.MessageType
  }

  export type NestedEnumMsgStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MsgStatus | EnumMsgStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MsgStatus[] | ListEnumMsgStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MsgStatus[] | ListEnumMsgStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMsgStatusFilter<$PrismaModel> | $Enums.MsgStatus
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumMessageTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageType | EnumMessageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageType[] | ListEnumMessageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageTypeWithAggregatesFilter<$PrismaModel> | $Enums.MessageType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageTypeFilter<$PrismaModel>
    _max?: NestedEnumMessageTypeFilter<$PrismaModel>
  }

  export type NestedEnumMsgStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MsgStatus | EnumMsgStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MsgStatus[] | ListEnumMsgStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MsgStatus[] | ListEnumMsgStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMsgStatusWithAggregatesFilter<$PrismaModel> | $Enums.MsgStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMsgStatusFilter<$PrismaModel>
    _max?: NestedEnumMsgStatusFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    isSet?: boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}