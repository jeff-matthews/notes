# Overview

I need to better align my Product Billing epic (TP-129) with John's timeline for feature delivery.

Gather more information at first VT AMP weekly huddle (2/21) to better organize stories in the epic.

## Phase 1
Product features:

  - Business CRUD in the VT UI
  - Business API so Clio can automate migrating current customers to the new system

Documentation needs:

  - Businesses API reference
  - Business Management User Guide

## Phase 2
Product features:
  - Manage payment methods in the VT UI and Businesses API

Documentation needs:
  - Update Business Management User Guide
  - Update Businesses API Reference

## General Notes
OpenAPI Question:
    - Is it normal to have separate definitions for request and response examples? See Businesses def for example.
    - If the request and response examples only differ by a few properties, create response defs that ref the request defs + then enter the standalone props (e.g., id)
    - see https://github.com/OAI/OpenAPI-Specification/issues/270 for more info

John's Feedback (2/28/17):
  - john to send me example 500 and 422 responses
  - Internal info: Only the tenant that creates the saved card/bank can attach it to a biz during creation process or there will be failures when they try to run charges
  - Clio workflow:
    - take CC info for a biz and get one-time token
    - use one-time token to created a saved card
    - create biz with saved card as saved payment method
      - one-time tokens must be used within 5 mins, but saved cars from token don't, that's the advantage
  - tenants and merchants
    - only a tenant can see the merchants that belong to that tenant. no uber tenant that can see all
    - there could be duplicate merchants under diff tenants (especially with early partners), but a Clio tenant merchant won't necessarily have a log in :
      - existing merchant under affinipay tenant (onboarded by clio)
      - tenant like clio will create a business for this merchant under their tenant which also creates another merchant, but Clio will only run transactions against the affinipay merchant tenant
      - this is weird and confusing... may need john to explain it again
      - not exactly sure how this would impact partners or merchants... it probably doesn't, but be it may crop up later
        - for now, just remove any reference to businesses being a merchant as it's more of a backend implementation detail that would only needlessly confuse partners
