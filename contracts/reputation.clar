;; Reputation System
;; Tracks reliability scores for vessels and traders.

(define-constant ERR-INVALID-SCORE (err u400))
(define-map reputation { user: principal } { score: uint, reviews: uint })

(define-public (add-review (user principal) (score uint))
  (begin
    (asserts! (<= score u5) ERR-INVALID-SCORE)
