;; Stacks Maritime Trading - Vessel Registry
;; Manages registration and status of maritime vessels.

;; Error Codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-VESSEL-ALREADY-EXISTS (err u101))
(define-constant ERR-VESSEL-NOT-FOUND (err u102))
(define-map vessels { vessel-id: uint } { owner: principal, name: (string-ascii 64), capacity: uint, status: (string-ascii 20) })
(define-public (register-vessel (vessel-id uint) (name (string-ascii 64)) (capacity uint))
