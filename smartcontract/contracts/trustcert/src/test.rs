#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_initialize() {
    let env = Env::default();
    let contract_id = env.register(TrustCertContract, ());
    let client = TrustCertContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);
}

#[test]
#[should_panic(expected = "Already initialized")]
fn test_double_initialize() {
    let env = Env::default();
    let contract_id = env.register(TrustCertContract, ());
    let client = TrustCertContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);
    client.initialize(&admin);
}

#[test]
fn test_issue_and_get_cert() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(TrustCertContract, ());
    let client = TrustCertContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let student = Address::generate(&env);
    let hash = String::from_str(&env, "cert_hash_123");
    let metadata = String::from_str(&env, "{\"name\":\"John Doe\"}");

    client.issue_cert(&admin, &student, &hash, &metadata);

    let cert = client.get_cert(&hash);
    assert_eq!(cert.issuer, admin);
    assert_eq!(cert.student, student);
    assert_eq!(cert.hash, hash);
    assert_eq!(cert.metadata, metadata);
}

#[test]
#[should_panic(expected = "Only admin can issue certificates")]
fn test_unauthorized_issue() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(TrustCertContract, ());
    let client = TrustCertContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let unauthorized_user = Address::generate(&env);
    let student = Address::generate(&env);
    let hash = String::from_str(&env, "cert_hash_123");
    let metadata = String::from_str(&env, "{}");

    client.issue_cert(&unauthorized_user, &student, &hash, &metadata);
}

#[test]
fn test_revoke_cert() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(TrustCertContract, ());
    let client = TrustCertContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let hash = String::from_str(&env, "cert_hash_123");
    
    assert_eq!(client.is_revoked(&hash), false);
    
    client.revoke_cert(&admin, &hash);
    
    assert_eq!(client.is_revoked(&hash), true);
}

#[test]
#[should_panic(expected = "Only admin can revoke")]
fn test_unauthorized_revoke() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(TrustCertContract, ());
    let client = TrustCertContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let unauthorized_user = Address::generate(&env);
    let hash = String::from_str(&env, "cert_hash_123");

    client.revoke_cert(&unauthorized_user, &hash);
}
