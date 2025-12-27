;; Trade Manager Contract
;; Handles cargo booking and delivery tracking.

(define-constant ERR-CARGO-NOT-FOUND (err u200))
(define-constant ERR-INSUFFICIENT-FUNDS (err u201))
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-data-var cargo-id-counter uint u0)
