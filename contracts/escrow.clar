;; Escrow Contract
;; Manages payment escrow for cargo delivery.

(define-constant ERR-ESCROW-NOT-FOUND (err u300))
(define-constant ERR-ALREADY-RELEASED (err u301))
(define-constant ERR-NOT-AUTHORIZED (err u100))

(define-map escrows { escrow-id: uint } { buyer: principal, seller: principal, amount: uint, released: bool })
