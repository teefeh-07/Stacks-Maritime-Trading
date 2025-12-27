;; Reputation System
;; Tracks reliability scores for vessels and traders.

(define-constant ERR-INVALID-SCORE (err u400))
(define-map reputation { user: principal } { score: uint, reviews: uint })

(define-public (add-review (user principal) (score uint))
  (begin
    (asserts! (<= score u5) ERR-INVALID-SCORE)
    (let ((current (default-to { score: u0, reviews: u0 } (map-get? reputation { user: user }))))
      (ok (map-set reputation { user: user } { score: (+ (get score current) score), reviews: (+ (get reviews current) u1) }))
    )
  )
)

(define-read-only (get-reputation (user principal))
