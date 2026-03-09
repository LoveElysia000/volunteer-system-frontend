import { ref, h, render, watch } from 'vue'
import type { Component } from 'vue'
import Dialog from '@/components/ui/Dialog.vue'

interface ConfirmOptions {
  title?: string
  content?: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'danger'
  width?: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

interface DialogInstance {
  close: () => void
  destroy: () => void
}

export function useDialog() {
  // 确认对话框
  const confirm = (options: ConfirmOptions): DialogInstance => {
    const container = document.createElement('div')
    const open = ref(true)
    const loading = ref(false)

    const close = () => {
      open.value = false
      setTimeout(() => {
        render(null, container)
        container.remove()
      }, 300)
    }

    const handleConfirm = async () => {
      if (options.onConfirm) {
        loading.value = true
        try {
          await options.onConfirm()
          close()
        } finally {
          loading.value = false
        }
      } else {
        close()
      }
    }

    const vNode = h(Dialog, {
      modelValue: open.value,
      'onUpdate:modelValue': (val: boolean) => {
        open.value = val
        if (!val) close()
      },
      title: options.title || '提示',
      content: options.content,
      confirmText: options.confirmText || '确定',
      cancelText: options.cancelText || '取消',
      confirmVariant: options.confirmVariant || 'primary',
      width: options.width || '400px',
      confirmLoading: loading.value,
      onConfirm: handleConfirm,
      onCancel: () => {
        options.onCancel?.()
        close()
      }
    })

    render(vNode, container)
    document.body.appendChild(container)

    // 响应式更新 loading
    watch(loading, (val) => {
      vNode.component!.props.confirmLoading = val
    })

    return {
      close,
      destroy: close
    }
  }

  // 信息提示（只确定按钮）
  const info = (options: Omit<ConfirmOptions, 'onCancel'>) => {
    return confirm({
      ...options,
      confirmVariant: 'primary'
    })
  }

  // 警告提示
  const warning = (options: Omit<ConfirmOptions, 'onCancel'>) => {
    return confirm({
      ...options,
      confirmVariant: 'danger'
    })
  }

  // 成功提示
  const success = (content: string, title = '成功') => {
    return confirm({
      title,
      content,
      confirmText: '知道了',
      confirmVariant: 'primary'
    })
  }

  // 错误提示
  const error = (content: string, title = '错误') => {
    return confirm({
      title,
      content,
      confirmText: '知道了',
      confirmVariant: 'danger'
    })
  }

  // 程序式打开自定义内容
  const open = (component: Component, props: Record<string, any> = {}): DialogInstance => {
    const container = document.createElement('div')
    const show = ref(true)

    const close = () => {
      show.value = false
      setTimeout(() => {
        render(null, container)
        container.remove()
      }, 300)
    }

    const vNode = h(Dialog, {
      modelValue: show.value,
      'onUpdate:modelValue': (val: boolean) => {
        show.value = val
        if (!val) close()
      },
      showFooter: false,
      width: '500px'
    }, {
      default: () => h(component, {
        ...props,
        onClose: close
      })
    })

    render(vNode, container)
    document.body.appendChild(container)

    return { close, destroy: close }
  }

  return {
    confirm,
    info,
    warning,
    success,
    error,
    open
  }
}

export default useDialog

