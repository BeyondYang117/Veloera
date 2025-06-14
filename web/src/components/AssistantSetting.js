import React, { useState, useEffect } from 'react';
import { API, showError, showSuccess } from '../helpers';
import { Button, Form, Typography, Spin } from '@douyinfe/semi-ui';

const { Text } = Typography;

// 模拟数据，当 API 不可用时使用
const mockData = {
  apiUrl: 'https://api.openai.com/v1/chat/completions',
  apiKey: '',
  model: 'gpt-3.5-turbo',
  enabled: false,
  modelOptions: [
    { label: 'gpt-4o', value: 'gpt-4o' },
    { label: 'gpt-4', value: 'gpt-4' },
    { label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' },
    { label: 'claude-3-opus-20240229', value: 'claude-3-opus-20240229' },
    { label: 'claude-3-sonnet-20240229', value: 'claude-3-sonnet-20240229' },
    { label: 'claude-3-haiku-20240307', value: 'claude-3-haiku-20240307' }
  ]
};

const AssistantSetting = () => {
  const [inputs, setInputs] = useState({
    apiUrl: mockData.apiUrl,
    apiKey: mockData.apiKey,
    model: mockData.model,
    enabled: mockData.enabled
  });
  const [loading, setLoading] = useState(false);
  const [modelOptions, setModelOptions] = useState(mockData.modelOptions);
  const [apiAvailable, setApiAvailable] = useState(true);

  const getOptions = async () => {
    try {
      const res = await API.get('/api/option');
      const { success, data } = res.data || res;

      if (success && data) {
        let assistantSettings = data.find(item => item.key === 'AssistantSettings');

        if (assistantSettings && assistantSettings.value) {
          try {
            const settings = JSON.parse(assistantSettings.value);
            setInputs({
              apiUrl: settings.api_url || mockData.apiUrl,
              apiKey: settings.api_key || mockData.apiKey,
              model: settings.model || mockData.model,
              enabled: settings.enabled === true
            });
            setApiAvailable(true);
          } catch (e) {
            console.error('解析AI小助手设置失败', e);
            setApiAvailable(false);
          }
        } else {
          // 如果没有找到设置，使用默认值
          setInputs({
            apiUrl: mockData.apiUrl,
            apiKey: mockData.apiKey,
            model: mockData.model,
            enabled: mockData.enabled
          });
          setApiAvailable(true);
        }
      } else {
        console.warn('获取设置失败，使用模拟数据');
        setApiAvailable(false);
      }
    } catch (error) {
      console.warn('API不可用，使用模拟数据', error);
      setApiAvailable(false);
    }
  };

  const getModels = async () => {
    try {
      const res = await API.get('/api/models');
      const { success, data } = res.data || res;
      if (success && Array.isArray(data) && data.length > 0) {
        const options = data.map(model => ({
          label: model,
          value: model
        }));
        setModelOptions(options);
      } else {
        console.warn('获取模型列表失败，使用模拟数据');
      }
    } catch (error) {
      console.warn('API不可用，使用模拟模型数据', error);
    }
  };

  useEffect(() => {
    getOptions();
    getModels();
  }, []);

  const updateOption = async () => {
    setLoading(true);
    try {
      if (!apiAvailable) {
        setTimeout(() => {
          showSuccess('模拟保存成功！(API不可用)');
          setLoading(false);
        }, 500);
        return;
      }

      const settings = {
        api_url: inputs.apiUrl,
        api_key: inputs.apiKey,
        model: inputs.model,
        enabled: inputs.enabled
      };

      const res = await API.put('/api/option/', {
        key: 'AssistantSettings',
        value: JSON.stringify(settings)
      });

      if (res.data?.success || res.success) {
        showSuccess('保存成功！');
      } else {
        showError(res.data?.message || res.message || '保存失败');
      }
    } catch (error) {
      if (!apiAvailable) {
        showSuccess('模拟保存成功！(API不可用)');
      } else {
        showError('保存失败: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value, name) => {
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target ? e.target.checked : e;
    setInputs({
      ...inputs,
      enabled: checked
    });
  };

  return (
    <div style={{ padding: '16px 0' }}>
      <Text strong style={{ fontSize: '16px', marginBottom: '16px', display: 'block' }}>AI小助手设置</Text>
      {!apiAvailable && (
        <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: 'rgba(255, 229, 143, 0.2)', borderRadius: '4px' }}>
          <Text type="warning">后端API不可用，显示模拟数据</Text>
        </div>
      )}
      <Text style={{ marginBottom: '16px', display: 'block' }}>
        AI小助手设置用于配置系统的AI服务。管理员配置后，所有用户都可以使用AI助手功能。
      </Text>
      {loading ? (
        <Spin />
      ) : (
        <Form>
          <Form.Input
            field="apiUrl"
            label="API地址"
            placeholder="例如：https://api.openai.com/v1/chat/completions"
            value={inputs.apiUrl}
            onChange={(value) => handleInputChange(value, 'apiUrl')}
            style={{ width: '100%' }}
          />
          <Form.Input
            field="apiKey"
            label="API密钥"
            placeholder="输入API密钥（sk-xxx）"
            value={inputs.apiKey}
            onChange={(value) => handleInputChange(value, 'apiKey')}
            type="password"
            style={{ width: '100%' }}
          />
          <Form.Select
            field="model"
            label="模型"
            style={{ width: '100%' }}
            optionList={modelOptions}
            value={inputs.model}
            onChange={(value) => handleInputChange(value, 'model')}
          />
          <Form.Checkbox
            field="enabled"
            checked={inputs.enabled}
            onChange={(checked) => handleCheckboxChange(checked)}
          >
            启用AI小助手功能
          </Form.Checkbox>
          <Button type="primary" onClick={updateOption} style={{ marginTop: '16px' }}>保存</Button>
        </Form>
      )}
    </div>
  );
};

export default AssistantSetting; 