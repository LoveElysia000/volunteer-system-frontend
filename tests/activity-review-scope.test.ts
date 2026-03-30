import assert from 'node:assert/strict'

import {
  AUDIT_STATUS_APPROVED,
  AUDIT_STATUS_PENDING,
  AUDIT_STATUS_REJECTED,
  getAuditStatusFilterText,
  getAuditStatusRequest,
  normalizeAuditStatus,
  resolveSelectedAuditStatus
} from '../src/views/Organization/activityReviewStatus.ts'

assert.equal(normalizeAuditStatus(AUDIT_STATUS_PENDING), AUDIT_STATUS_PENDING)
assert.equal(normalizeAuditStatus(String(AUDIT_STATUS_PENDING)), AUDIT_STATUS_PENDING)
assert.equal(normalizeAuditStatus(AUDIT_STATUS_APPROVED), AUDIT_STATUS_APPROVED)
assert.equal(normalizeAuditStatus(String(AUDIT_STATUS_REJECTED)), AUDIT_STATUS_REJECTED)
assert.equal(normalizeAuditStatus('unexpected'), undefined)
assert.equal(normalizeAuditStatus(undefined), undefined)

assert.deepEqual(getAuditStatusRequest('all'), [
  AUDIT_STATUS_PENDING,
  AUDIT_STATUS_APPROVED,
  AUDIT_STATUS_REJECTED
])
assert.equal(getAuditStatusFilterText(String(AUDIT_STATUS_PENDING)), '待审核')
assert.equal(getAuditStatusFilterText(String(AUDIT_STATUS_APPROVED)), '审核通过')
assert.equal(getAuditStatusFilterText(String(AUDIT_STATUS_REJECTED)), '审核拒绝')

assert.equal(resolveSelectedAuditStatus({
  selectedAuditId: 2,
  selectedAuditStatus: AUDIT_STATUS_PENDING,
  detailAuditId: 1,
  detailAuditStatus: AUDIT_STATUS_APPROVED
}), AUDIT_STATUS_PENDING)

assert.equal(resolveSelectedAuditStatus({
  selectedAuditId: 2,
  selectedAuditStatus: undefined,
  detailAuditId: 2,
  detailAuditStatus: String(AUDIT_STATUS_REJECTED)
}), AUDIT_STATUS_REJECTED)
