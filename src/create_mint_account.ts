// src/utils/create_mint_account.ts
export const CreateMintAccount = {
  "version": "0.1.0",
  "name": "create_mint_account",
  "instructions": [
    {
      "name": "initializeConfig",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true, 
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "receivers",
          "type": {
            "vec": "publicKey"
          }
        },
        {
          "name": "ratios",
          "type": {
            "vec": "u8"
          }
        }
      ]
    },
    {
      "name": "transferAndSplit",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateRatiosAndReceivers", 
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "newReceivers",
          "type": {
            "vec": "publicKey"
          }
        },
        {
          "name": "newRatios",
          "type": {
            "vec": "u8"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "ConfigAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "receivers", 
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "ratios",
            "type": {
              "vec": "u8"
            }
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidRatio",
      "msg": "Total ratio must equal 100"
    },
    {
      "code": 6001, 
      "name": "MathOverflow",
      "msg": "Math overflow"
    },
    {
      "code": 6002,
      "name": "Unauthorized", 
      "msg": "Unauthorized user"
    }
  ],
  "metadata": {
    "address": "HnoMtMBjarMYksbUdQdqpNYCb9ds43EPt0wyh44ADv3J"
  }
};