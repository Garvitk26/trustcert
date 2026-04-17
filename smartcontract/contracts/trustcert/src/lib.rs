#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CertData {
    pub issuer: Address,
    pub student: Address,
    pub hash: String,
    pub metadata: String,
    pub issue_date: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Cert(String),  // Key by hash
    Revoked(String), // Key by hash
}

#[contract]
pub struct TrustCertContract;

#[contractimpl]
impl TrustCertContract {
    /// Initialize the contract with an admin address.
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Issue a new certificate. Only the admin can issue certificates.
    pub fn issue_cert(env: Env, issuer: Address, student: Address, hash: String, metadata: String) {
        issuer.require_auth();
        
        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Contract not initialized");
        if issuer != admin {
             panic!("Only admin can issue certificates");
        }

        let key = DataKey::Cert(hash.clone());
        if env.storage().persistent().has(&key) {
            panic!("Certificate already exists");
        }

        let cert = CertData {
            issuer: issuer.clone(),
            student: student.clone(),
            hash: hash.clone(),
            metadata,
            issue_date: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&key, &cert);
        
        // Extend TTL for persistent storage
        env.storage().persistent().extend_ttl(&key, 1000, 5000);
    }

    /// Retrieve certificate data by its hash.
    pub fn get_cert(env: Env, hash: String) -> CertData {
        let key = DataKey::Cert(hash);
        env.storage().persistent().get(&key).expect("Certificate not found")
    }

    /// Revoke a certificate. Only the admin can revoke certificates.
    pub fn revoke_cert(env: Env, admin: Address, hash: String) {
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Contract not initialized");
        if admin != stored_admin {
            panic!("Only admin can revoke");
        }

        let rev_key = DataKey::Revoked(hash);
        env.storage().persistent().set(&rev_key, &true);
        env.storage().persistent().extend_ttl(&rev_key, 1000, 5000);
    }

    /// Check if a certificate has been revoked.
    pub fn is_revoked(env: Env, hash: String) -> bool {
        let rev_key = DataKey::Revoked(hash);
        env.storage().persistent().get(&rev_key).unwrap_or(false)
    }
}

mod test;
